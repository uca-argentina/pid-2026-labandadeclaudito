import { db } from '@/lib/db'
import { MINUTOS_PARA_PAGAR_SENA } from '@/lib/estado-reserva'
import { diaDeHoy, diaDeReserva, turnoYaPaso } from '@/lib/time'

// Las pendientes cuyo plazo para pagar la seña ya pasó. Se usa como
// NOT: pendientesVencidas() en toda consulta de reservas que ocupan un turno
// o que se muestran: para el sistema, una vencida ya no existe.
export function pendientesVencidas(ahora: Date = new Date()) {
  const limite = new Date(ahora.getTime() - MINUTOS_PARA_PAGAR_SENA * 60 * 1000)
  return { estado: 'PENDIENTE' as const, createdAt: { lt: limite } }
}

// Reservas que todavía no se jugaron: son las que se cancelan al dar de baja
// una cancha o un complejo. Las pasadas quedan como historial.
export async function getUpcomingBookingIds(canchaIds: string[]) {
  return proximasReservas({ canchaId: { in: canchaIds } })
}

// Lo mismo, pero las de un jugador: se cancelan al suspender su cuenta.
export async function getUpcomingBookingIdsOfPlayer(jugadorId: string) {
  return proximasReservas({ jugadorId })
}

async function proximasReservas(filtro: { canchaId?: { in: string[] }; jugadorId?: string }) {
  const reservas = await db.reserva.findMany({
    where: {
      ...filtro,
      estado: { in: ['PENDIENTE', 'CONFIRMADA'] },
      fecha: { gte: new Date(diaDeHoy()) },
      NOT: pendientesVencidas(),
    },
  })

  const idsDeReservas: string[] = []
  for (const reserva of reservas) {
    if (!turnoYaPaso(diaDeReserva(reserva.fecha), reserva.horaInicio)) {
      idsDeReservas.push(reserva.id)
    }
  }
  return idsDeReservas
}
