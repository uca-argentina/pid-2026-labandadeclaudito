import { NextResponse } from 'next/server'
import { Prisma } from '@/lib/generated/prisma/client'
import { createDisputeSchema } from '@/lib/validations/dispute'
import { requireRole } from '@/lib/auth-helpers'
import { MENSAJE_PLAZO_VENCIDO, vencioElPlazoParaDisputar } from '@/lib/disputas'
import { estadoDeReserva } from '@/lib/estado-reserva'
import { diaDeReserva, momentoActual } from '@/lib/time'
import { db } from '@/lib/db'

const MENSAJE_DISPUTA_REPETIDA = 'Ya abriste una disputa por este turno'

export async function POST(request: Request) {
  const { session, error, status } = await requireRole('JUGADOR')
  if (!session) return NextResponse.json({ error }, { status })

  const body = await request.json()
  const parsed = createDisputeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const reserva = await db.reserva.findUnique({
    where: { id: parsed.data.reservaId },
    include: { disputa: true },
  })
  if (!reserva) {
    return NextResponse.json({ error: 'La reserva no existe' }, { status: 404 })
  }
  if (reserva.jugadorId !== session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const ahora = momentoActual()
  const dia = diaDeReserva(reserva.fecha)
  const visible = estadoDeReserva(
    {
      estado: reserva.estado,
      asistio: reserva.asistio,
      dia,
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
    },
    ahora,
  )
  if (visible !== 'NO_SHOW' || !reserva.asistenciaMarcadaEn) {
    return NextResponse.json(
      { error: 'Solo se puede disputar un turno en el que el complejo te marcó como ausente' },
      { status: 409 },
    )
  }

  const diaDeLaMarca = momentoActual(reserva.asistenciaMarcadaEn).dia
  if (vencioElPlazoParaDisputar(diaDeLaMarca, ahora.dia)) {
    return NextResponse.json({ error: MENSAJE_PLAZO_VENCIDO }, { status: 409 })
  }

  if (reserva.disputa) {
    return NextResponse.json({ error: MENSAJE_DISPUTA_REPETIDA }, { status: 409 })
  }

  try {
    const disputa = await db.disputa.create({
      data: {
        reservaId: reserva.id,
        jugadorId: session.user.id,
        descripcion: parsed.data.descripcion,
      },
    })
    return NextResponse.json({ disputa }, { status: 201 })
  } catch (e) {
    // Dos envíos al mismo tiempo: el @unique de reservaId frena al segundo
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: MENSAJE_DISPUTA_REPETIDA }, { status: 409 })
    }
    throw e
  }
}
