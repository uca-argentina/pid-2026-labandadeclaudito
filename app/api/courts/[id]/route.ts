import { NextResponse } from 'next/server'
import { updateCourtSchema } from '@/lib/validations/court'
import { requireRole } from '@/lib/auth-helpers'
import { getCourtWithComplex } from '@/lib/ownership'
import { getUpcomingBookingIds } from '@/lib/bookings'
import { franjaDentroDelHorario } from '@/lib/time'
import { db } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const cancha = await getCourtWithComplex(id)
  if (!cancha || cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
  }

  const body = await request.json()
  const parsed = updateCourtSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  // Los turnos arrancan en la hora de apertura y se suceden cada
  // duracionTurnoMin: si cambia cualquiera de los dos, los turnos nuevos
  // quedan corridos y se pisan con las reservas ya hechas. Solo se permite
  // si la cancha no tiene reservas por jugar.
  const cambianLosTurnos =
    parsed.data.duracionTurnoMin !== cancha.duracionTurnoMin ||
    parsed.data.horaApertura !== cancha.horaApertura
  if (cambianLosTurnos) {
    const idsDeReservas = await getUpcomingBookingIds([id])
    if (idsDeReservas.length > 0) {
      return NextResponse.json(
        {
          error:
            'No se puede cambiar la duración del turno ni la hora de apertura mientras la cancha tenga reservas por jugar',
        },
        { status: 409 },
      )
    }
  }

  // Si cambia el horario, los bloqueos y precios especiales que quedan afuera
  // (aunque sea en parte) se eliminan enteros. Los precios sin franja valen
  // todo el día, así que nunca quedan afuera.
  const { horaApertura, horaCierre } = parsed.data
  let idsDePrecios: string[] = []
  let idsDeBloqueos: string[] = []
  if (horaApertura !== cancha.horaApertura || horaCierre !== cancha.horaCierre) {
    const precios = await db.precioEspecial.findMany({
      where: { canchaId: id, activo: true, horaInicio: { not: null } },
    })
    idsDePrecios = precios
      .filter((p) => !franjaDentroDelHorario(p.horaInicio!, p.horaFin!, horaApertura, horaCierre))
      .map((p) => p.id)

    const bloqueos = await db.block.findMany({ where: { courtId: id } })
    idsDeBloqueos = bloqueos
      .filter((b) => !franjaDentroDelHorario(b.startTime, b.endTime, horaApertura, horaCierre))
      .map((b) => b.id)
  }

  // Precios: baja lógica, como en el resto de la app. Bloqueos: se borran.
  const [actualizada] = await db.$transaction([
    db.cancha.update({ where: { id }, data: parsed.data }),
    db.precioEspecial.updateMany({
      where: { id: { in: idsDePrecios } },
      data: { activo: false },
    }),
    db.block.deleteMany({ where: { id: { in: idsDeBloqueos } } }),
  ])

  return NextResponse.json(
    {
      cancha: actualizada,
      preciosEliminados: idsDePrecios.length,
      bloqueosEliminados: idsDeBloqueos.length,
    },
    { status: 200 },
  )
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('DUENIO')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params
  const cancha = await getCourtWithComplex(id)
  if (!cancha || cancha.complejo.duenioId !== session.user.id) {
    return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 })
  }

  // Baja lógica: se conserva la cancha para el historial de reservas
  const idsDeReservas = await getUpcomingBookingIds([id])

  // Estas cancelaciones las provoca el dueño, no el jugador: la seña se
  // devuelve siempre, sin mirar la política de horas.
  await db.$transaction([
    db.reserva.updateMany({
      where: { id: { in: idsDeReservas } },
      data: { estado: 'CANCELADA' },
    }),
    db.pago.updateMany({
      where: { reservaId: { in: idsDeReservas } },
      data: { devuelto: true },
    }),
    db.cancha.update({ where: { id }, data: { activo: false } }),
  ])

  return NextResponse.json({ ok: true, reservasCanceladas: idsDeReservas.length }, { status: 200 })
}
