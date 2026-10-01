import { db } from '@/lib/db'
import { getBlocksOfDay, isSlotBlocked } from '@/lib/blocks'
import { pendientesVencidas } from '@/lib/bookings'
import { Prisma } from '@/lib/generated/prisma/client'
import {
  diaDeReserva,
  diaSemanaDeReserva,
  generateSlots,
  horariosSeSuperponen,
  isTooSoonToBook,
} from '@/lib/time'

type PrecioEspecialVigente = {
  diaSemana: number | null
  horaInicio: string | null
  horaFin: string | null
  precio: Prisma.Decimal
}

// Elige, entre los PrecioEspecial que matchean el día/hora de un turno, el
// más específico: franja horaria gana sobre solo día, que gana sobre general
// (ni día ni franja). Sin ninguno que matchee, se usa precioBase.
export function precioDelTurno(
  precioBase: Prisma.Decimal,
  preciosEspeciales: PrecioEspecialVigente[],
  diaSemana: number,
  horaInicio: string,
): Prisma.Decimal {
  const queMatchean = preciosEspeciales.filter((precioEspecial) => {
    const diaOk = precioEspecial.diaSemana === null || precioEspecial.diaSemana === diaSemana
    const franjaOk =
      precioEspecial.horaInicio === null ||
      (horaInicio >= precioEspecial.horaInicio && horaInicio < precioEspecial.horaFin!)
    return diaOk && franjaOk
  })

  if (queMatchean.length === 0) {
    return precioBase
  }

  const masEspecifico = queMatchean.reduce((mejor, actual) => {
    const puntos = (p: PrecioEspecialVigente) =>
      (p.horaInicio !== null ? 2 : 0) + (p.diaSemana !== null ? 1 : 0)
    return puntos(actual) > puntos(mejor) ? actual : mejor
  })

  return masEspecifico.precio
}

// El último turno del día puede ser más corto que duracionTurnoMin (ver
// agregarSlots en lib/time.ts). Ese turno cobra la parte proporcional:
// 30 min de un turno de 90 = 1/3 del precio.
export function precioProporcional(
  precio: Prisma.Decimal,
  horaInicio: string,
  horaFin: string,
  duracionTurnoMin: number,
): Prisma.Decimal {
  const [inicioH, inicioM] = horaInicio.split(':').map(Number)
  const [finH, finM] = horaFin.split(':').map(Number)

  let minutosDelTurno = finH * 60 + finM - (inicioH * 60 + inicioM)
  // Un turno que termina a las 00:00 da negativo: termina al día siguiente
  if (minutosDelTurno <= 0) {
    minutosDelTurno += 24 * 60
  }

  if (minutosDelTurno >= duracionTurnoMin) {
    return precio
  }

  return precio.mul(minutosDelTurno).div(duracionTurnoMin).toDecimalPlaces(2)
}

export async function getAvailableSlots(
  canchaId: string,
  fecha: Date,
  jugadorId?: string,
): Promise<{
  slots: { horaInicio: string; horaFin: string; disponible: boolean; precio: Prisma.Decimal }[]
  porcentajeSena: number
  minAdvanceMinutes: number
} | null> {
  const cancha = await db.cancha.findFirst({
    where: { id: canchaId, activo: true, complejo: { activo: true } },
    include: {
      complejo: { select: { porcentajeSenaDefault: true, minAdvanceMinutesDefault: true } },
      preciosEspeciales: { where: { activo: true } },
    },
  })
  if (!cancha) {
    return null
  }

  const turnos = generateSlots(cancha.horaApertura, cancha.horaCierre, cancha.duracionTurnoMin)

  const reservas = await db.reserva.findMany({
    where: {
      canchaId,
      fecha,
      estado: { not: 'CANCELADA' },
      NOT: pendientesVencidas(),
    },
    select: { horaInicio: true },
  })
  const horasOcupadas = new Set(reservas.map((r) => r.horaInicio))
  const bloqueosDelDia = await getBlocksOfDay(canchaId, fecha)

  const dia = diaDeReserva(fecha)
  const minAdvanceMinutes = cancha.minAdvanceMinutes ?? cancha.complejo.minAdvanceMinutesDefault
  const diaSemana = diaSemanaDeReserva(fecha)

  // Si mira un jugador, también se marcan ocupados los turnos que se cruzan
  // con otra reserva suya (en cualquier cancha): no puede estar en dos
  // lados a la vez. POST /api/bookings hace el mismo chequeo.
  let reservasDelJugador: { horaInicio: string; horaFin: string }[] = []
  if (jugadorId) {
    reservasDelJugador = await db.reserva.findMany({
      where: { jugadorId, fecha, estado: { not: 'CANCELADA' }, NOT: pendientesVencidas() },
      select: { horaInicio: true, horaFin: true },
    })
  }

  const slots = turnos.map(({ horaInicio, horaFin }) => {
    const seCruzaConReservaDelJugador = reservasDelJugador.some((reserva) =>
      horariosSeSuperponen(horaInicio, horaFin, reserva.horaInicio, reserva.horaFin),
    )

    return {
      horaInicio,
      horaFin,
      disponible:
        !horasOcupadas.has(horaInicio) &&
        !isTooSoonToBook(dia, horaInicio, minAdvanceMinutes) &&
        !isSlotBlocked(horaInicio, horaFin, bloqueosDelDia) &&
        !seCruzaConReservaDelJugador,
      precio: precioProporcional(
        precioDelTurno(cancha.precioBase, cancha.preciosEspeciales, diaSemana, horaInicio),
        horaInicio,
        horaFin,
        cancha.duracionTurnoMin,
      ),
    }
  })

  return {
    slots,
    porcentajeSena: cancha.porcentajeSena ?? cancha.complejo.porcentajeSenaDefault,
    minAdvanceMinutes,
  }
}
