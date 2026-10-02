import { NextResponse } from 'next/server'
import { markAttendanceSchema } from '@/lib/validations/booking'
import { requireRole } from '@/lib/auth-helpers'
import { estadoDeReserva } from '@/lib/estado-reserva'
import { diaDeReserva, momentoActual } from '@/lib/time'
import { db } from '@/lib/db'

// El dueño marca si el jugador se presentó. Se puede volver a llamar para
// corregir la marca.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params

  const reserva = await db.reserva.findUnique({
    where: { id },
    include: { cancha: { include: { complejo: true } } },
  })
  if (!reserva || reserva.cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
  }

  const body = await request.json()
  const parsed = markAttendanceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  // Preguntamos el estado como si nunca se hubiera marcado: así una reserva ya
  // marcada sigue dando FINALIZADA y el dueño puede corregirse.
  const estadoSinMarcar = estadoDeReserva(
    {
      estado: reserva.estado,
      asistio: null,
      dia: diaDeReserva(reserva.fecha),
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
    },
    momentoActual(),
  )
  if (estadoSinMarcar !== 'FINALIZADA') {
    return NextResponse.json(
      { error: 'Solo se puede marcar la asistencia de un turno finalizado' },
      { status: 409 },
    )
  }

  await db.reserva.update({ where: { id }, data: { asistio: parsed.data.asistio } })

  return NextResponse.json({ ok: true }, { status: 200 })
}
