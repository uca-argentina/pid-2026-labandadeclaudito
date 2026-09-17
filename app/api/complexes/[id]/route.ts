import { NextResponse } from 'next/server'
import { createComplexSchema } from '@/lib/validations/complex'
import { requireRole } from '@/lib/auth-helpers'
import { getComplexByOwner } from '@/lib/ownership'
import { getUpcomingBookingIds } from '@/lib/bookings'
import { db } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) {
    return NextResponse.json({ error: 'Complejo no encontrado' }, { status: 404 })
  }

  const body = await request.json()
  // Los campos editables son los mismos que en el alta, así que se reusa el schema
  const parsed = createComplexSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const actualizado = await db.complejo.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json({ complejo: actualizado }, { status: 200 })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) {
    return NextResponse.json({ error: 'Complejo no encontrado' }, { status: 404 })
  }

  const canchas = await db.cancha.findMany({ where: { complejoId: id, activo: true } })
  const idsDeCanchas: string[] = []
  for (const cancha of canchas) {
    idsDeCanchas.push(cancha.id)
  }
  const idsDeReservas = await getUpcomingBookingIds(idsDeCanchas)

  // Baja lógica en cadena, todo o nada: si algo falla no queda a medias.
  // Las fotos siguen en Vercel Blob, así el complejo se podría reactivar.
  await db.$transaction([
    db.reserva.updateMany({
      where: { id: { in: idsDeReservas } },
      data: { estado: 'CANCELADA' },
    }),
    db.cancha.updateMany({ where: { complejoId: id }, data: { activo: false } }),
    db.imagenComplejo.updateMany({ where: { complejoId: id }, data: { activo: false } }),
    db.complejo.update({ where: { id }, data: { activo: false } }),
  ])

  return NextResponse.json({ ok: true, reservasCanceladas: idsDeReservas.length }, { status: 200 })
}
