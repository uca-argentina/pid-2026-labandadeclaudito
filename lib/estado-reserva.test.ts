import { describe, expect, test } from 'vitest'
import { estadoDeReserva } from './estado-reserva'

// Todas las reservas de los tests son el 2026-09-29 de 20:00 a 21:00, salvo
// que el test diga otra cosa.
const dia = '2026-09-29'

function estadoALas(hora: string, diaDeAhora = dia) {
  return estadoDeReserva('CONFIRMADA', dia, '20:00', '21:00', { dia: diaDeAhora, hora })
}

describe('estadoDeReserva', () => {
  test('una confirmada de otro día no depende de la hora', () => {
    expect(estadoALas('23:00', '2026-09-28')).toBe('CONFIRMADA')
    expect(estadoALas('08:00', '2026-09-30')).toBe('FINALIZADA')
  })

  test('una confirmada de hoy pasa por confirmada, en curso y finalizada', () => {
    expect(estadoALas('19:59')).toBe('CONFIRMADA')
    expect(estadoALas('20:00')).toBe('EN_CURSO')
    expect(estadoALas('20:30')).toBe('EN_CURSO')
    expect(estadoALas('21:00')).toBe('FINALIZADA')
  })

  test('un turno que termina a medianoche sigue en curso a las 23:30', () => {
    const ahora = { dia, hora: '23:30' }
    expect(estadoDeReserva('CONFIRMADA', dia, '23:00', '00:00', ahora)).toBe('EN_CURSO')
  })

  test('un turno de media hora transiciona igual que uno de una hora', () => {
    const turnoCorto = (hora: string) =>
      estadoDeReserva('CONFIRMADA', dia, '20:00', '20:30', { dia, hora })

    expect(turnoCorto('20:00')).toBe('EN_CURSO')
    expect(turnoCorto('20:29')).toBe('EN_CURSO')
    expect(turnoCorto('20:30')).toBe('FINALIZADA')
  })

  test('el reloj no pisa los estados que decidió una persona', () => {
    const enMedioDelTurno = { dia, hora: '20:30' }
    expect(estadoDeReserva('CANCELADA', dia, '20:00', '21:00', enMedioDelTurno)).toBe('CANCELADA')
    expect(estadoDeReserva('NO_SHOW', dia, '20:00', '21:00', enMedioDelTurno)).toBe('NO_SHOW')
  })

  test('una pendiente con el turno terminado sigue pendiente', () => {
    const despuesDelTurno = { dia, hora: '22:00' }
    expect(estadoDeReserva('PENDIENTE', dia, '20:00', '21:00', despuesDelTurno)).toBe('PENDIENTE')
  })
})
