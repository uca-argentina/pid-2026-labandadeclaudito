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

  // Sin seña pagada no hay nada que devolver; con seña, se decide si se
  // devuelve según la política de cancelación.
  const pago = reserva.pago
  const devuelto = pago
    ? refundsDeposit(
        dia,
        reserva.horaInicio,
        pago.cancellationHours,
        reserva.cancha.complejo.cancellationHours,
      )
    : false

  // Entre que se leyó la reserva y ahora, el jugador pudo haber pagado la
  // seña (o cancelado dos veces). Por eso se cancela solo si sigue en el
  // estado en que se leyó: si justo pagó, la decisión de devolver la seña se
  // tomaría sin ver ese pago. Y la devolución se marca en la misma transacción.
  const cancelada = await db.$transaction(async (tx) => {
    const canceladas = await tx.reserva.updateMany({
      where: { id, estado: reserva.estado },
      data: { estado: 'CANCELADA' },
    })
    if (canceladas.count === 0) return false

    if (pago) {
      await tx.pago.update({ where: { reservaId: id }, data: { devuelto } })
    }
    return true
  })
  if (!cancelada) {
    return NextResponse.json(
      { error: 'La reserva cambió mientras cancelabas. Recargá la página.' },
      { status: 409 },
    )
  }

  return NextResponse.json({ ok: true, devuelto }, { status: 200 })
}
