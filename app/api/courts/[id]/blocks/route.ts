import { NextResponse } from 'next/server'
import { createBlockSchema } from '@/lib/validations/block'
import { requireRole } from '@/lib/auth-helpers'
import { getCourtWithComplex } from '@/lib/ownership'
import { findOverlappingBlock, findOverlappingBookingIds } from '@/lib/blocks'
import { db } from '@/lib/db'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id: courtId } = await params
  const cancha = await getCourtWithComplex(courtId)
  if (!cancha || cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
  }

  const body = await request.json()
  const parsed = createBlockSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const bloqueSolapado = await findOverlappingBlock(courtId, parsed.data)
  if (bloqueSolapado) {
    return NextResponse.json({ error: 'Ese horario ya tiene un bloqueo cargado' }, { status: 409 })
  }

  const idsDeReservas = await findOverlappingBookingIds(courtId, parsed.data)

  const [block] = await db.$transaction([
    db.block.create({
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
        courtId,
      },
    }),
    db.reserva.updateMany({
      where: { id: { in: idsDeReservas } },
      data: { estado: 'CANCELADA' },
    }),
  ])

  return NextResponse.json({ block, reservasCanceladas: idsDeReservas.length }, { status: 201 })
}
