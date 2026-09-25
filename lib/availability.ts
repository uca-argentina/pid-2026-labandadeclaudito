import { db } from '@/lib/db'
import { getBlocksOfDay, isSlotBlocked } from '@/lib/blocks'
import { Prisma } from '@/lib/generated/prisma/client'
import { diaDeReserva, diaSemanaDeReserva, turnoYaPaso } from '@/lib/time'

type PrecioEspecialVigente = {
  diaSemana: number | null
  horaInicio: string | null
  horaFin: string | null
  precio: Prisma.Decimal
}

function agregarSlots(
  slots: string[],
  minutoInicio: number,
  minutoFin: number,
  duracionTurnoMin: number,
): void {
  for (
    let minuto = minutoInicio;
    minuto + duracionTurnoMin <= minutoFin;
    minuto += duracionTurnoMin
  ) {
    const horas = String(Math.floor(minuto / 60)).padStart(2, '0')
    const minutos = String(minuto % 60).padStart(2, '0')
    slots.push(`${horas}:${minutos}`)
  }
}

export function generateSlots(
  horaApertura: string,
  horaCierre: string,
  duracionTurnoMin: number,
): string[] {
  const [horaAperturaH, horaAperturaM] = horaApertura.split(':').map(Number)
  const [horaCierreH, horaCierreM] = horaCierre.split(':').map(Number)

  const minutoInicio = horaAperturaH * 60 + horaAperturaM
  const minutoCierre = horaCierreH * 60 + horaCierreM

  const slots: string[] = []

  // Si el cierre es a una hora "menor o igual" que la apertura, en realidad
  // cierra al día siguiente (ej: abre 20:00, cierra 03:00). Generamos primero
  // los turnos de la madrugada (00:00 al cierre) y después los de la noche
  // (apertura a medianoche), para que la lista quede ordenada de 00:00 a 23:xx.
  if (minutoCierre <= minutoInicio) {
    agregarSlots(slots, 0, minutoCierre, duracionTurnoMin)
    agregarSlots(slots, minutoInicio, 24 * 60, duracionTurnoMin)
  } else {
    agregarSlots(slots, minutoInicio, minutoCierre, duracionTurnoMin)
  }

  return slots
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

export async function getAvailableSlots(
  canchaId: string,
  fecha: Date,
): Promise<{
  slots: { horaInicio: string; disponible: boolean; precio: Prisma.Decimal }[]
  porcentajeSena: number
} | null> {
  const cancha = await db.cancha.findFirst({
    where: { id: canchaId, activo: true, complejo: { activo: true } },
    include: {
      complejo: { select: { porcentajeSenaDefault: true } },
      preciosEspeciales: { where: { activo: true } },
    },
  })
  if (!cancha) {
    return null
  }

  const horasDeTurnos = generateSlots(
    cancha.horaApertura,
    cancha.horaCierre,
    cancha.duracionTurnoMin,
  )

  const reservas = await db.reserva.findMany({
    where: {
      canchaId,
      fecha,
      estado: { not: 'CANCELADA' },
    },
    select: { horaInicio: true },
  })
  const horasOcupadas = new Set(reservas.map((r) => r.horaInicio))
  const bloqueosDelDia = await getBlocksOfDay(canchaId, fecha)

  const dia = diaDeReserva(fecha)
  const diaSemana = diaSemanaDeReserva(fecha)

  const slots = horasDeTurnos.map((horaInicio) => ({
    horaInicio,
    disponible:
      !horasOcupadas.has(horaInicio) &&
      !turnoYaPaso(dia, horaInicio) &&
      !isSlotBlocked(horaInicio, cancha.duracionTurnoMin, bloqueosDelDia),
    precio: precioDelTurno(cancha.precioBase, cancha.preciosEspeciales, diaSemana, horaInicio),
  }))

  return {
    slots,
    porcentajeSena: cancha.porcentajeSena ?? cancha.complejo.porcentajeSenaDefault,
  }
}
