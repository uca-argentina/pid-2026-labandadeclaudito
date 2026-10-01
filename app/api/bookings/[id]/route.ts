import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-helpers'
import { MENSAJE_SENA_VENCIDA, senaVencida } from '@/lib/estado-reserva'
import { diaDeReserva, refundsDeposit, turnoYaPaso } from '@/lib/time'
import { db } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('JUGADOR')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params

  const reserva = await db.reserva.findUnique({
    where: { id },
    include: { pago: true, cancha: { include: { complejo: true } } },
  })
  if (!reserva) {
    return NextResponse.json({ error: 'La reserva no existe' }, { status: 404 })
  }
  if (reserva.jugadorId !== session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  if (reserva.estado === 'CANCELADA') {
    return NextResponse.json({ error: 'La reserva ya estaba cancelada' }, { status: 409 })
  }
  if (reserva.estado === 'PENDIENTE' && senaVencida(reserva.createdAt)) {
    return NextResponse.json({ error: MENSAJE_SENA_VENCIDA }, { status: 409 })
  }

  const dia = diaDeReserva(reserva.fecha)
  if (turnoYaPaso(dia, reserva.horaInicio)) {
    return NextResponse.json(
      { error: 'No se puede cancelar un turno que ya pasó' },
      { status: 400 },
    )
  }

  // Sin seña pagada no hay nada que devolver: solo se cancela la reserva.
  if (!reserva.pago) {
    await db.reserva.update({ where: { id }, data: { estado: 'CANCELADA' } })
    return NextResponse.json({ ok: true, devuelto: false }, { status: 200 })
  }

  const devuelto = refundsDeposit(
    dia,
    reserva.horaInicio,
    reserva.pago.cancellationHours,
    reserva.cancha.complejo.cancellationHours,
  )

  await db.$transaction([
    db.reserva.update({ where: { id }, data: { estado: 'CANCELADA' } }),
    db.pago.update({ where: { reservaId: id }, data: { devuelto } }),
  ])

  return NextResponse.json({ ok: true, devuelto }, { status: 200 })
}
