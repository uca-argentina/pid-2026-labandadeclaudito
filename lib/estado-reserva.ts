import type { EstadoReserva } from '@/lib/generated/prisma/client'

// Los estados que ve el usuario. Los de la base son decisiones de una persona;
// EN_CURSO y FINALIZADA salen del reloj y no se guardan nunca.
export type EstadoVisible = EstadoReserva | 'EN_CURSO' | 'FINALIZADA'

export function estadoDeReserva(
  estado: EstadoReserva,
  dia: string,
  horaInicio: string,
  horaFin: string,
  ahora: { dia: string; hora: string },
): EstadoVisible {
  if (estado === 'CANCELADA') return 'CANCELADA'
  if (estado === 'NO_SHOW') return 'NO_SHOW'
  if (estado === 'PENDIENTE') return 'PENDIENTE'

  // Solo una CONFIRMADA depende del reloj.
  if (ahora.dia < dia) return 'CONFIRMADA'
  if (ahora.dia > dia) return 'FINALIZADA'

  // Un turno que termina a medianoche tiene fin "00:00", que como texto es
  // menor que cualquier hora: se lo compara como "24:00" (igual que en
  // horariosSeSuperponen).
  const finComparable = horaFin === '00:00' ? '24:00' : horaFin

  if (ahora.hora < horaInicio) return 'CONFIRMADA'
  if (ahora.hora < finComparable) return 'EN_CURSO'
  return 'FINALIZADA'
}
