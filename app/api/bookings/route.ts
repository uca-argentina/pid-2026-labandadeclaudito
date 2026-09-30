import { NextResponse } from 'next/server'
import { Prisma } from '@/lib/generated/prisma/client'
import { createBookingSchema } from '@/lib/validations/booking'
import { requireRole } from '@/lib/auth-helpers'
import { generateSlots, precioDelTurno } from '@/lib/availability'
import { getBlocksOfDay, isSlotBlocked } from '@/lib/blocks'
import {
  diaSemanaDeReserva,
  formatAdvanceTime,
  horariosSeSuperponen,
  isTooSoonToBook,
  sumarMinutos,
} from '@/lib/time'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { session, error, status } = await requireRole('JUGADOR')
  if (!session) return NextResponse.json({ error }, { status })

  const body = await request.json()
  const parsed = createBookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const cancha = await db.cancha.findFirst({
    where: { id: parsed.data.canchaId, activo: true, complejo: { activo: true } },
    include: {
      preciosEspeciales: { where: { activo: true } },
      complejo: { select: { minAdvanceMinutesDefault: true } },
    },
  })
  if (!cancha) {
    return NextResponse.json({ error: 'La cancha no existe' }, { status: 404 })
  }

  const minAdvanceMinutes = cancha.minAdvanceMinutes ?? cancha.complejo.minAdvanceMinutesDefault
  if (isTooSoonToBook(parsed.data.fecha, parsed.data.horaInicio, minAdvanceMinutes)) {
    if (minAdvanceMinutes === 0) {
      return NextResponse.json({ error: 'Ese turno ya pasó' }, { status: 400 })
    }
    return NextResponse.json(
      {
        error: `Este turno se reserva con al menos ${formatAdvanceTime(minAdvanceMinutes)} de anticipación`,
      },
      { status: 400 },
    )
  }

  // La grilla de turnos también se muestra en el cliente, pero acá hay que
  // recalcularla: un POST directo podría pedir un horario fuera del horario
  // de la cancha o pisado entre dos turnos.
  const slots = generateSlots(cancha.horaApertura, cancha.horaCierre, cancha.duracionTurnoMin)
  if (!slots.includes(parsed.data.horaInicio)) {
    return NextResponse.json(
      { error: 'Ese horario no es un turno de esta cancha' },
      { status: 400 },
    )
  }

  const fecha = new Date(parsed.data.fecha)
  const horaFin = sumarMinutos(parsed.data.horaInicio, cancha.duracionTurnoMin)

  const bloqueosDelDia = await getBlocksOfDay(cancha.id, fecha)
  if (isSlotBlocked(parsed.data.horaInicio, cancha.duracionTurnoMin, bloqueosDelDia)) {
    return NextResponse.json({ error: 'Ese horario está bloqueado' }, { status: 409 })
  }

  // Un jugador no puede estar en dos canchas a la vez: se busca otra reserva
  // suya ese mismo día cuyo horario se cruce con el turno pedido.
  const reservasDelJugador = await db.reserva.findMany({
    where: { jugadorId: session.user.id, fecha, estado: { not: 'CANCELADA' } },
  })
  for (const otraReserva of reservasDelJugador) {
    if (
      horariosSeSuperponen(
        parsed.data.horaInicio,
        horaFin,
        otraReserva.horaInicio,
        otraReserva.horaFin,
      )
    ) {
      return NextResponse.json(
        { error: 'Ya tenés otra reserva que se superpone con ese horario' },
        { status: 409 },
      )
    }
  }

  // El precio se calcula siempre acá, nunca se confía en lo que mande el
  // cliente: precioBase puede tener un PrecioEspecial pisándolo. Queda
  // congelado en la Reserva para siempre.
  const precioTurno = precioDelTurno(
    cancha.precioBase,
    cancha.preciosEspeciales,
    diaSemanaDeReserva(fecha),
    parsed.data.horaInicio,
  )

  const reservaExistente = await db.reserva.findUnique({
    where: {
      canchaId_fecha_horaInicio: {
        canchaId: cancha.id,
        fecha,
        horaInicio: parsed.data.horaInicio,
      },
    },
  })

  if (reservaExistente && reservaExistente.estado !== 'CANCELADA') {
    return NextResponse.json({ error: 'Ese horario ya fue reservado' }, { status: 409 })
  }

  // Si la reserva anterior se canceló el turno está libre, pero el índice único
  // no deja crear otra fila para la misma cancha/fecha/hora: se reusa esa.
  if (reservaExistente) {
    const reserva = await db.$transaction(async (tx) => {
      const reserva = await tx.reserva.update({
        where: { id: reservaExistente.id },
        data: { jugadorId: session.user.id, horaFin, estado: 'PENDIENTE', precioTurno },
      })
      // La fila se reusa, así que el Pago de la reserva cancelada anterior
      // quedaría colgado: se borra, la nueva reserva todavía no pagó seña.
      await tx.pago.deleteMany({ where: { reservaId: reserva.id } })
      return reserva
    })
    return NextResponse.json({ reserva }, { status: 201 })
  }

  // La reserva nace PENDIENTE (de seña): pasa a CONFIRMADA recién cuando el
  // jugador paga la seña en POST /api/bookings/[id]/deposit.
  try {
    const reserva = await db.reserva.create({
      data: {
        canchaId: cancha.id,
        jugadorId: session.user.id,
        fecha,
        horaInicio: parsed.data.horaInicio,
        horaFin,
        estado: 'PENDIENTE',
        precioTurno,
      },
    })
    return NextResponse.json({ reserva }, { status: 201 })
  } catch (e) {
    // Dos jugadores pidiendo el mismo turno a la vez: el índice único lo corta.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: 'Ese horario ya fue reservado' }, { status: 409 })
    }
    throw e
  }
}
