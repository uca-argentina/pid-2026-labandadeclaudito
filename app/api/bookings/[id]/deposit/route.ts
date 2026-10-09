import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-helpers'
import { MENSAJE_SENA_VENCIDA, senaVencida } from '@/lib/estado-reserva'
import { diaDeReserva, turnoYaPaso } from '@/lib/time'
import { db } from '@/lib/db'

// Pago simulado de la seña: no hay pasarela de pagos, alcanza con llamar a
// este endpoint para que la reserva pase de PENDIENTE a CONFIRMADA.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('JUGADOR')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params

  const reserva = await db.reserva.findUnique({
    where: { id },
    include: { cancha: { include: { complejo: true } } },
  })
  if (!reserva) {
    return NextResponse.json({ error: 'La reserva no existe' }, { status: 404 })
  }
  if (reserva.jugadorId !== session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  if (reserva.estado !== 'PENDIENTE') {
    return NextResponse.json({ error: 'La reserva no está pendiente de seña' }, { status: 409 })
  }
  if (senaVencida(reserva.createdAt)) {
    return NextResponse.json({ error: MENSAJE_SENA_VENCIDA }, { status: 409 })
  }
  if (turnoYaPaso(diaDeReserva(reserva.fecha), reserva.horaInicio)) {
    return NextResponse.json({ error: 'El turno ya empezó' }, { status: 400 })
  }

  // El % de seña es el de la cancha o, si no tiene uno propio, el del
  // complejo. Se calcula sobre el precio congelado de la reserva y queda
  // congelado en el Pago, junto con la política de cancelación actual.
  const porcentajeSena =
    reserva.cancha.porcentajeSena ?? reserva.cancha.complejo.porcentajeSenaDefault
  const montoSena = reserva.precioTurno.mul(porcentajeSena).div(100)

  // Entre que se leyó la reserva y ahora, el jugador pudo haberla cancelado
  // (o tocado "Pagar" dos veces). Por eso pasa a CONFIRMADA solo si sigue
  // PENDIENTE: si no, no se cobra nada. Y el pago se crea en la misma
  // transacción, así nunca queda uno sin el otro.
  const pagada = await db.$transaction(async (tx) => {
    const confirmadas = await tx.reserva.updateMany({
      where: { id, estado: 'PENDIENTE' },
      data: { estado: 'CONFIRMADA' },
    })
    if (confirmadas.count === 0) return false

    await tx.pago.create({
      data: {
        reservaId: id,
        monto: montoSena,
        porcentaje: porcentajeSena,
        cancellationHours: reserva.cancha.complejo.cancellationHours,
      },
    })
    return true
  })
  if (!pagada) {
    return NextResponse.json(
      { error: 'La reserva cambió mientras pagabas. Recargá la página.' },
      { status: 409 },
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
