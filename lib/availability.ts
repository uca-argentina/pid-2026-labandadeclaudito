import { db } from '@/lib/db'
import { diaDeReserva, turnoYaPaso } from '@/lib/time'

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
  for (
    let minuto = minutoInicio;
    minuto + duracionTurnoMin <= minutoCierre;
    minuto += duracionTurnoMin
  ) {
    const horas = String(Math.floor(minuto / 60)).padStart(2, '0')
    const minutos = String(minuto % 60).padStart(2, '0')
    slots.push(`${horas}:${minutos}`)
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
