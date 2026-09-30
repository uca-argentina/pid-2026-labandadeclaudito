import type { EstadoReserva } from '@/lib/generated/prisma/client'

// Los estados que ve el usuario. Los de la base (PENDIENTE, CONFIRMADA,
// CANCELADA) son decisiones de una persona; el resto sale del reloj y de la
// asistencia que marcó el dueño, y no se guardan nunca.
export type EstadoVisible = EstadoReserva | 'EN_CURSO' | 'FINALIZADA' | 'ASISTIO' | 'NO_SHOW'

type ReservaParaEstado = {
  estado: EstadoReserva
  asistio: boolean | null
  dia: string
  horaInicio: string
  horaFin: string
}

export function estadoDeReserva(
  reserva: ReservaParaEstado,
  ahora: { dia: string; hora: string },
): EstadoVisible {
  const { estado, asistio, dia, horaInicio, horaFin } = reserva

  if (estado === 'CANCELADA') return 'CANCELADA'
  if (estado === 'PENDIENTE') return 'PENDIENTE'

  // Solo una CONFIRMADA depende del reloj.
  if (ahora.dia < dia) return 'CONFIRMADA'
  if (ahora.dia > dia) return estadoDeUnTurnoTerminado(asistio)

  // Un turno que termina a medianoche tiene fin "00:00", que como texto es
  // menor que cualquier hora: se lo compara como "24:00" (igual que en
  // horariosSeSuperponen).
  const finComparable = horaFin === '00:00' ? '24:00' : horaFin

  if (ahora.hora < horaInicio) return 'CONFIRMADA'
  if (ahora.hora < finComparable) return 'EN_CURSO'
  return estadoDeUnTurnoTerminado(asistio)
}

// Terminado el turno, lo que manda es si el dueño marcó la asistencia.
function estadoDeUnTurnoTerminado(asistio: boolean | null): EstadoVisible {
  if (asistio === true) return 'ASISTIO'
  if (asistio === false) return 'NO_SHOW'
  return 'FINALIZADA'
}
