import { db } from '@/lib/db'
import type { Prisma } from '@/lib/generated/prisma/client'
import { MINUTOS_PARA_PAGAR_SENA } from '@/lib/estado-reserva'
import { diaDeHoy, diaDeReserva, momentoActual, turnoYaPaso } from '@/lib/time'

// Las pendientes cuyo plazo para pagar la seña ya pasó. Se usa como
// NOT: pendientesVencidas() en toda consulta de reservas que ocupan un turno
// o que se muestran: para el sistema, una vencida ya no existe.
export function pendientesVencidas(ahora: Date = new Date()) {
  const limite = new Date(ahora.getTime() - MINUTOS_PARA_PAGAR_SENA * 60 * 1000)
  return { estado: 'PENDIENTE' as const, createdAt: { lt: limite } }
}

// Las reservas que se muestran en "Próximas". Es la misma regla que
// estadoDeReserva(), pero escrita como where para que la base pueda contar y
// paginar sin traer todas las reservas:
// - una CONFIRMADA es próxima hasta que termina el turno (la que está en
//   curso también). Un turno que termina a medianoche tiene fin "00:00", que
//   como texto es menor que cualquier hora: ese es próximo todo el día.
// - una PENDIENTE es próxima hasta que empieza el turno (igual que turnoYaPaso).
// Las horas son "HH:MM", así que compararlas como texto alcanza.
function esProxima(ahora: { dia: string; hora: string }): Prisma.ReservaWhereInput {
  const hoy = new Date(ahora.dia)
  return {
    OR: [
      { estado: 'CONFIRMADA', fecha: { gt: hoy } },
      { estado: 'CONFIRMADA', fecha: hoy, horaFin: { gt: ahora.hora } },
      { estado: 'CONFIRMADA', fecha: hoy, horaFin: '00:00' },
      { estado: 'PENDIENTE', fecha: { gt: hoy } },
      { estado: 'PENDIENTE', fecha: hoy, horaInicio: { gte: ahora.hora } },
    ],
  }
}

// Las dos ya dejan afuera las pendientes con la seña vencida: no se muestran
// en ninguna sección.
export function dondeProximas(ahora = momentoActual()): Prisma.ReservaWhereInput {
  return {
    ...esProxima(ahora),
    NOT: pendientesVencidas(),
  }
}

// "Historial": todo lo que no está cancelado y ya no es próximo.
export function dondeHistorial(ahora = momentoActual()): Prisma.ReservaWhereInput {
  return {
    estado: { not: 'CANCELADA' },
    NOT: [pendientesVencidas(), esProxima(ahora)],
  }
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

// Ojo: no es lo mismo que dondeProximas(). Para cancelar alcanza con que el
// turno no haya empezado; uno en curso no se cancela.
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
