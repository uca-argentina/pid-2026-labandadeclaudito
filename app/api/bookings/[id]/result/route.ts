import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-helpers'
import { sePuedeCalificar } from '@/lib/estado-reserva'
import { diaDeReserva, momentoActual } from '@/lib/time'
import { db } from '@/lib/db'
import { resultBookingSchema, responderResultadoSchema } from '@/lib/validations/booking'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('JUGADOR')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params

  const body = await request.json()
  const parsed = resultBookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const reserva = await db.reserva.findUnique({
    where: { id },
    include: { cancha: true, participantes: { where: { jugadorId: session.user.id } } },
  })
  if (!reserva) {
    return NextResponse.json({ error: 'La reserva no existe' }, { status: 404 })
  }

  const esElQueReservo = reserva.jugadorId === session.user.id
  const seSumo = reserva.participantes.length > 0
  if (!esElQueReservo && !seSumo) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const turno = {
    estado: reserva.estado,
    asistio: reserva.asistio,
    dia: diaDeReserva(reserva.fecha),
    horaInicio: reserva.horaInicio,
    horaFin: reserva.horaFin,
  }
  if (!sePuedeCalificar(turno, momentoActual())) {
    return NextResponse.json(
      { error: 'El resultado solo puede cargarse una vez que el horario de juego pasó' },
      { status: 409 },
    )
  }

  await db.reserva.update({
    where: { id: reserva.id },
    data: {
      resultadoCargadoPorId: session.user.id,
      resultado: parsed.data.resultado,
      estadoResultado: 'REGISTRADO',
    },
  })

  return NextResponse.json({ ok: true }, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params

  const body = await request.json()
  const parsed = responderResultadoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const reserva = await db.reserva.findUnique({
    where: { id },
    include: {
      cancha: { include: { complejo: true } },
      participantes: { where: { jugadorId: session.user.id } },
    },
  })
  if (!reserva) {
    return NextResponse.json({ error: 'La reserva no existe' }, { status: 404 })
  }

  if (!reserva.resultado) {
    return NextResponse.json({ error: 'Todavía no hay resultado' }, { status: 409 })
  }

  await db.reserva.update({
    where: { id },
    data: {
      estadoResultado: parsed.data.accion === 'CONFIRMAR' ? 'CONFIRMADO' : 'PENDIENTE_CONFIRMACION',
    },
  })
  return NextResponse.json({ ok: true }, { status: 200 })
}
