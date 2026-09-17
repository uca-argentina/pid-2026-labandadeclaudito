import { db } from '@/lib/db'
import { diaDeReserva, turnoYaPaso } from '@/lib/time'

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

export async function getAvailableSlots(
  canchaId: string,
  fecha: Date,
): Promise<{ horaInicio: string; disponible: boolean }[] | null> {
  const cancha = await db.cancha.findFirst({
    where: { id: canchaId, activo: true, complejo: { activo: true } },
  })
  if (!cancha) {
    return null
  }

  const slots = generateSlots(cancha.horaApertura, cancha.horaCierre, cancha.duracionTurnoMin)

  const reservas = await db.reserva.findMany({
    where: {
      canchaId,
      fecha,
      estado: { not: 'CANCELADA' },
    },
    select: { horaInicio: true },
  })
  const horasOcupadas = new Set(reservas.map((r) => r.horaInicio))

  const dia = diaDeReserva(fecha)

  return slots.map((horaInicio) => ({
    horaInicio,
    disponible: !horasOcupadas.has(horaInicio) && !turnoYaPaso(dia, horaInicio),
  }))
}
