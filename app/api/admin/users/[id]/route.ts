import { NextResponse } from 'next/server'
import { cambiarActivoSchema } from '@/lib/validations/user'
import { requireRole } from '@/lib/auth-helpers'
import { getUpcomingBookingIds, getUpcomingBookingIdsOfPlayer } from '@/lib/bookings'
import { db } from '@/lib/db'

// El admin suspende o reactiva una cuenta. Una cuenta suspendida no puede
// loguearse, y si tenía la sesión abierta la pierde en el próximo request
// (auth.ts revisa activo en cada auth(), ver lib/rol-vigente.ts).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error, status } = await requireRole('ADMIN')
  if (!session) return NextResponse.json({ error }, { status })

  const { id } = await params

  if (id === session.user.id) {
    return NextResponse.json({ error: 'No podés suspender tu propia cuenta' }, { status: 400 })
  }

  const body = await request.json()
  const parsed = cambiarActivoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const usuario = await db.usuario.findUnique({ where: { id } })
  if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // Reactivar no devuelve nada de lo que se canceló al suspender.
  if (parsed.data.activo) {
    await db.usuario.update({ where: { id }, data: { activo: true } })
    return NextResponse.json({ ok: true, reservasCanceladas: 0 }, { status: 200 })
  }

  // Al suspender se cancelan las reservas que todavía no se jugaron: las del
  // jugador, o las de las canchas del dueño.
  let idsDeReservas: string[] = []
  if (usuario.rol === 'JUGADOR') {
    idsDeReservas = await getUpcomingBookingIdsOfPlayer(id)
  }
  if (usuario.rol === 'DUENIO') {
    const canchas = await db.cancha.findMany({ where: { complejo: { duenioId: id } } })
    const idsDeCanchas: string[] = []
    for (const cancha of canchas) {
      idsDeCanchas.push(cancha.id)
    }
    idsDeReservas = await getUpcomingBookingIds(idsDeCanchas)
  }

  // Todo o nada, igual que la baja de un complejo. La cancelación no la
  // decide el jugador: la seña se devuelve siempre, sin mirar la política.
  await db.$transaction([
    db.reserva.updateMany({
      where: { id: { in: idsDeReservas } },
      data: { estado: 'CANCELADA' },
    }),
    db.pago.updateMany({
      where: { reservaId: { in: idsDeReservas } },
      data: { devuelto: true },
    }),
    db.usuario.update({ where: { id }, data: { activo: false } }),
  ])

  return NextResponse.json({ ok: true, reservasCanceladas: idsDeReservas.length }, { status: 200 })
}
