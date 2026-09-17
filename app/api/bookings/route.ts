import { NextResponse } from 'next/server'
import { Prisma } from '@/lib/generated/prisma/client'
import { createBookingSchema } from '@/lib/validations/booking'
import { requireRole } from '@/lib/auth-helpers'
import { generateSlots } from '@/lib/availability'
import { sumarMinutos, turnoYaPaso } from '@/lib/time'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { session, error, status } = await requireRole('JUGADOR')
  if (!session) return NextResponse.json({ error }, { status })

  const body = await request.json()
  const parsed = createBookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const cancha = await db.cancha.findUnique({ where: { id: parsed.data.canchaId } })
  if (!cancha) {
    return NextResponse.json({ error: 'La cancha no existe' }, { status: 404 })
  }

  if (turnoYaPaso(parsed.data.fecha, parsed.data.horaInicio)) {
    return NextResponse.json({ error: 'Ese turno ya pasó' }, { status: 400 })
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
    const reserva = await db.reserva.update({
      where: { id: reservaExistente.id },
      data: { jugadorId: session.user.id, horaFin, estado: 'CONFIRMADA' },
    })
    return NextResponse.json({ reserva }, { status: 201 })
  }

  try {
    const reserva = await db.reserva.create({
      data: {
        canchaId: cancha.id,
        jugadorId: session.user.id,
        fecha,
        horaInicio: parsed.data.horaInicio,
        horaFin,
        estado: 'CONFIRMADA',
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
