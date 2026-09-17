import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-helpers'
import { diaDeReserva, turnoYaPaso } from '@/lib/time'
import { db } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('JUGADOR')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params

  const reserva = await db.reserva.findUnique({ where: { id } })
  if (!reserva) {
    return NextResponse.json({ error: 'La reserva no existe' }, { status: 404 })
  }
  if (reserva.jugadorId !== session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  if (reserva.estado === 'CANCELADA') {
    return NextResponse.json({ error: 'La reserva ya estaba cancelada' }, { status: 409 })
  }

  if (turnoYaPaso(diaDeReserva(reserva.fecha), reserva.horaInicio)) {
    return NextResponse.json(
      { error: 'No se puede cancelar un turno que ya pasó' },
      { status: 400 },
    )
  }

  await db.reserva.update({ where: { id }, data: { estado: 'CANCELADA' } })

  return NextResponse.json({ ok: true }, { status: 200 })
}
