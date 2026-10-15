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
    include: { cancha: { include: { complejo: true } }, disputa: true },
  })
  if (!reserva || reserva.cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
  }

  // Con una disputa abierta el dueño no puede cambiar la marca mientras el
  // admin la revisa; con una resuelta, la decisión del admin es definitiva.
  if (reserva.disputa) {
    return NextResponse.json({ error: 'La reserva tiene una disputa' }, { status: 409 })
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

  // La fecha de la marca es el arranque del plazo para disputar: se guarda de
  // nuevo en cada corrección, así el jugador siempre tiene el plazo completo.
  await db.reserva.update({
    where: { id },
    data: { asistio: parsed.data.asistio, asistenciaMarcadaEn: new Date() },
  })

  return NextResponse.json({ ok: true }, { status: 200 })
}
