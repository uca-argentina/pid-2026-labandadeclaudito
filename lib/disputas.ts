import { estadoDeReserva, type ReservaParaEstado } from '@/lib/estado-reserva'
import { momentoActual, sumarDias } from '@/lib/time'

export const DIAS_PARA_DISPUTAR = 7

export function ultimoDiaParaDisputar(diaDeLaMarca: string): string {
  return sumarDias(diaDeLaMarca, DIAS_PARA_DISPUTAR)
}

// El plazo corre desde que el dueño marcó la asistencia, no desde el turno:
// así no puede esperar a que pasen los 7 días para marcar el no-show, y si
// vuelve a marcarlo el jugador tiene de nuevo todo el plazo.
export function vencioElPlazoParaDisputar(diaDeLaMarca: string, hoy: string): boolean {
  return hoy > ultimoDiaParaDisputar(diaDeLaMarca)
}

// Armado con la constante: si cambia el plazo, el mensaje lo acompaña
export const MENSAJE_PLAZO_VENCIDO = `Pasaron más de ${DIAS_PARA_DISPUTAR} días desde que el complejo cargó la falta: ya no se puede disputar.`

type ReservaParaDisputar = ReservaParaEstado & {
  asistenciaMarcadaEn: Date | null
}

// Solo se disputa un no-show: si el dueño todavía no marcó la asistencia, no
// hay nada que cuestionar. Es la misma regla que chequea el endpoint, y la usa
// el historial del jugador para mostrar o esconder el botón "Disputar".
export function sePuedeDisputar(
  reserva: ReservaParaDisputar,
  ahora: { dia: string; hora: string },
): boolean {
  if (estadoDeReserva(reserva, ahora) !== 'NO_SHOW') return false
  if (!reserva.asistenciaMarcadaEn) return false

  const diaDeLaMarca = momentoActual(reserva.asistenciaMarcadaEn).dia
  return !vencioElPlazoParaDisputar(diaDeLaMarca, ahora.dia)
}
