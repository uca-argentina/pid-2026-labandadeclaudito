import { db } from '@/lib/db'
import { diaDeHoy, diaDeReserva, turnoYaPaso } from '@/lib/time'

// Reservas que todavía no se jugaron: son las que se cancelan al dar de baja
// una cancha o un complejo. Las pasadas quedan como historial.
export async function getUpcomingBookingIds(canchaIds: string[]) {
  const reservas = await db.reserva.findMany({
    where: {
      canchaId: { in: canchaIds },
      estado: { in: ['PENDIENTE', 'CONFIRMADA'] },
      fecha: { gte: new Date(diaDeHoy()) },
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
