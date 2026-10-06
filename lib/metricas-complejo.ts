import { db } from '@/lib/db'
import { isSlotBlocked } from '@/lib/blocks'
import { pendientesVencidas } from '@/lib/bookings'
import { diaDeReserva, diaSemanaDeReserva, generateSlots } from '@/lib/time'

type HorarioDeCancha = {
  horaApertura: string
  horaCierre: string
  duracionTurnoMin: number
}

type BloqueoDeCancha = {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}

export type HorarioPedido = {
  // 0 (domingo) a 6 (sábado)
  diaSemana: number
  horaInicio: string
  reservas: number
}

export type MetricasComplejo = {
  // porcentaje de 0 a 100
  ocupacion: { turnosReservados: number; turnosOfrecidos: number; porcentaje: number }
  ingresos: number
  cancelaciones: number
  noShows: number
  demanda: HorarioPedido[]
}

// Todos los días entre desde y hasta (YYYY-MM-DD, los dos incluidos).
export function diasDelRango(desde: string, hasta: string): string[] {
  const dias: string[] = []
  const fecha = new Date(`${desde}T00:00:00Z`)
  const fin = new Date(`${hasta}T00:00:00Z`)

  while (fecha <= fin) {
    dias.push(diaDeReserva(fecha))
    fecha.setUTCDate(fecha.getUTCDate() + 1)
  }
  return dias
}

// Turnos que una cancha ofreció en esos días: los de su horario, menos los
// que caen dentro de algún bloqueo vigente ese día.
export function contarTurnosOfrecidos(
  cancha: HorarioDeCancha,
  dias: string[],
  bloqueos: BloqueoDeCancha[],
): number {
  const turnosDelDia = generateSlots(
    cancha.horaApertura,
    cancha.horaCierre,
    cancha.duracionTurnoMin,
  )
  let total = 0

  for (const dia of dias) {
    const bloqueosDelDia = bloqueos.filter(
      (bloqueo) => bloqueo.startDate <= dia && dia <= bloqueo.endDate,
    )
    for (const turno of turnosDelDia) {
      if (!isSlotBlocked(turno.horaInicio, turno.horaFin, bloqueosDelDia)) {
        total++
      }
    }
  }
  return total
}

// Cuántas reservas hubo por cada día de la semana + hora de inicio, de la
// más pedida a la menos pedida.
export function horariosDeMayorDemanda(
  reservas: { fecha: Date; horaInicio: string }[],
): HorarioPedido[] {
  const horarios: HorarioPedido[] = []

  for (const reserva of reservas) {
    const diaSemana = diaSemanaDeReserva(reserva.fecha)
    const existente = horarios.find(
      (horario) => horario.diaSemana === diaSemana && horario.horaInicio === reserva.horaInicio,
    )
    if (existente) {
      existente.reservas++
    } else {
      horarios.push({ diaSemana, horaInicio: reserva.horaInicio, reservas: 1 })
    }
  }

  return horarios.sort((a, b) => b.reservas - a.reservas)
}

// Métricas de un complejo (o de una sola cancha suya) entre desde y hasta
// (YYYY-MM-DD, incluidos). Quien llama ya chequeó que el complejo es del
// dueño logueado.
export async function metricasDelComplejo(
  complejoId: string,
  desde: string,
  hasta: string,
  canchaId?: string,
): Promise<MetricasComplejo> {
  // Se incluyen las canchas dadas de baja: sus reservas pasadas siguen
  // contando para ingresos y cancelaciones.
  const canchas = await db.cancha.findMany({
    where: { complejoId, id: canchaId },
    include: {
      blocks: {
        where: { startDate: { lte: new Date(hasta) }, endDate: { gte: new Date(desde) } },
      },
    },
  })

  const reservas = await db.reserva.findMany({
    where: {
      canchaId: { in: canchas.map((cancha) => cancha.id) },
      fecha: { gte: new Date(desde), lte: new Date(hasta) },
      NOT: pendientesVencidas(),
    },
    select: {
      canchaId: true,
      fecha: true,
      horaInicio: true,
      estado: true,
      asistio: true,
      pago: { select: { monto: true, devuelto: true } },
    },
  })

  // Ocupación: solo canchas activas, porque una dada de baja ya no ofrece
  // turnos. Se cuentan sus reservas confirmadas contra sus turnos ofrecidos.
  // ponytail: usa el horario actual de la cancha para todo el rango; si el
  // dueño lo cambió, los días viejos se cuentan con el horario nuevo.
  const dias = diasDelRango(desde, hasta)
  const idsDeCanchasActivas: string[] = []
  let turnosOfrecidos = 0

  for (const cancha of canchas) {
    if (!cancha.activo) continue
    idsDeCanchasActivas.push(cancha.id)

    const bloqueos = cancha.blocks.map((bloqueo) => ({
      startDate: diaDeReserva(bloqueo.startDate),
      endDate: diaDeReserva(bloqueo.endDate),
      startTime: bloqueo.startTime,
      endTime: bloqueo.endTime,
    }))
    turnosOfrecidos += contarTurnosOfrecidos(cancha, dias, bloqueos)
  }

  let turnosReservados = 0
  let ingresos = 0
  let cancelaciones = 0
  let noShows = 0

  for (const reserva of reservas) {
    if (reserva.estado === 'CONFIRMADA' && idsDeCanchasActivas.includes(reserva.canchaId)) {
      turnosReservados++
    }
    if (reserva.estado === 'CANCELADA') {
      cancelaciones++
    }
    if (reserva.estado === 'CONFIRMADA' && reserva.asistio === false) {
      noShows++
    }
    // Lo que el complejo se quedó: señas no devueltas (incluye no-shows y
    // cancelaciones fuera de término).
    if (reserva.pago && !reserva.pago.devuelto) {
      ingresos += Number(reserva.pago.monto)
    }
  }

  const reservasActivas = reservas.filter((reserva) => reserva.estado !== 'CANCELADA')

  return {
    ocupacion: {
      turnosReservados,
      turnosOfrecidos,
      // Sin turnos ofrecidos (rango vacío o todo bloqueado) es 0.
      porcentaje:
        turnosOfrecidos === 0 ? 0 : Math.round((turnosReservados / turnosOfrecidos) * 100),
    },
    ingresos,
    cancelaciones,
    noShows,
    demanda: horariosDeMayorDemanda(reservasActivas),
  }
}
