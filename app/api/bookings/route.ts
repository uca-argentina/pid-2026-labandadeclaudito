import { NextResponse } from 'next/server'
import { Prisma } from '@/lib/generated/prisma/client'
import { createBookingSchema } from '@/lib/validations/booking'
import { requireRole } from '@/lib/auth-helpers'
import { generateSlots, precioDelTurno } from '@/lib/availability'
import { diaSemanaDeReserva, sumarMinutos, turnoYaPaso } from '@/lib/time'
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
      complejo: { select: { porcentajeSenaDefault: true } },
      preciosEspeciales: { where: { activo: true } },
    },
  })
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

  // Precio y seña se calculan siempre acá, nunca se confía en lo que mande
  // el cliente: precioBase puede tener un PrecioEspecial pisándolo, y el %
  // de seña puede ser el de la cancha o, si no tiene uno propio, el del
  // complejo. Ambos quedan congelados en la Reserva/Pago para siempre.
  const precioTurno = precioDelTurno(
    cancha.precioBase,
    cancha.preciosEspeciales,
    diaSemanaDeReserva(fecha),
    parsed.data.horaInicio,
  )
  const porcentajeSena = cancha.porcentajeSena ?? cancha.complejo.porcentajeSenaDefault
  const montoSena = precioTurno.mul(porcentajeSena).div(100)

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
        data: { jugadorId: session.user.id, horaFin, estado: 'CONFIRMADA', precioTurno },
      })
      // La fila se reusa, así que el Pago de la reserva cancelada anterior
      // también: se pisa con los datos de esta nueva reserva.
      await tx.pago.upsert({
        where: { reservaId: reserva.id },
        create: { reservaId: reserva.id, monto: montoSena, porcentaje: porcentajeSena },
        update: { monto: montoSena, porcentaje: porcentajeSena, devuelto: false },
      })
      return reserva
    })
    return NextResponse.json({ reserva }, { status: 201 })
  }

  try {
    const reserva = await db.$transaction(async (tx) => {
      const reserva = await tx.reserva.create({
        data: {
          canchaId: cancha.id,
          jugadorId: session.user.id,
          fecha,
          horaInicio: parsed.data.horaInicio,
          horaFin,
          estado: 'CONFIRMADA',
          precioTurno,
        },
      })
      await tx.pago.create({
        data: { reservaId: reserva.id, monto: montoSena, porcentaje: porcentajeSena },
      })
      return reserva
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
