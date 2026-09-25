import { NextResponse } from 'next/server'
import { updateBlockSchema } from '@/lib/validations/block'
import { requireRole } from '@/lib/auth-helpers'
import { getBlockWithComplex } from '@/lib/ownership'
import { findOverlappingBlock, findOverlappingBookingIds } from '@/lib/blocks'
import { db } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const block = await getBlockWithComplex(id)
  if (!block || block.court.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Bloqueo no encontrado' }, { status: 404 })
  }

  const body = await request.json()
  const parsed = updateBlockSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const bloqueSolapado = await findOverlappingBlock(block.courtId, parsed.data, id)
  if (bloqueSolapado) {
    return NextResponse.json({ error: 'Ese horario ya tiene un bloqueo cargado' }, { status: 409 })
  }

  const idsDeReservas = await findOverlappingBookingIds(block.courtId, parsed.data)

  const [actualizado] = await db.$transaction([
    db.block.update({
      where: { id },
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
      },
    }),
    db.reserva.updateMany({
      where: { id: { in: idsDeReservas } },
      data: { estado: 'CANCELADA' },
    }),
  ])

  return NextResponse.json(
    { block: actualizado, reservasCanceladas: idsDeReservas.length },
    { status: 200 },
  )
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const block = await getBlockWithComplex(id)
  if (!block || block.court.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Bloqueo no encontrado' }, { status: 404 })
  }

  await db.block.delete({ where: { id } })

  return NextResponse.json({ ok: true }, { status: 200 })
}
