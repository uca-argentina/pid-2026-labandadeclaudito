import { NextResponse } from 'next/server'
import { Prisma } from '@/lib/generated/prisma/client'
import { createBookingSchema } from '@/lib/validations/booking'
import { requireRole } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { session, error, status } = await requireRole('JUGADOR')
  if (!session) return NextResponse.json({ error }, { status })

  const body = await request.json()
  const parsed = createBookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  try {
    const reserva = await db.reserva.create({
      data: {
        canchaId: parsed.data.canchaId,
        jugadorId: session.user.id,
        fecha: new Date(parsed.data.fecha),
        horaInicio: parsed.data.horaInicio,
        horaFin: parsed.data.horaInicio,
        estado: 'CONFIRMADA',
      },
    })
    return NextResponse.json({ reserva }, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: 'Ese horario ya fue reservado' }, { status: 409 })
    }
    throw e
  }
}
