import { NextResponse } from 'next/server'
import { updatePriceSchema } from '@/lib/validations/price'
import { requireRole } from '@/lib/auth-helpers'
import { getPriceWithComplex } from '@/lib/ownership'
import { db } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const precioEspecial = await getPriceWithComplex(id)
  if (!precioEspecial || precioEspecial.cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Precio especial no encontrado' }, { status: 404 })
  }

  const body = await request.json()
  const parsed = updatePriceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const actualizado = await db.precioEspecial.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json({ precioEspecial: actualizado }, { status: 200 })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const precioEspecial = await getPriceWithComplex(id)
  if (!precioEspecial || precioEspecial.cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Precio especial no encontrado' }, { status: 404 })
  }

  // Baja lógica, como el resto de la app: reservas ya hechas con este precio
  // congelado no dependen de esta fila, pero se conserva el historial.
  await db.precioEspecial.update({ where: { id }, data: { activo: false } })

  return NextResponse.json({ ok: true }, { status: 200 })
}
