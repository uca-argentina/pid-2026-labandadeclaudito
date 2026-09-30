import { describe, expect, test } from 'vitest'
import { estadoDeReserva } from './estado-reserva'

// Todas las reservas de los tests son el 2026-09-29 de 20:00 a 21:00, salvo
// que el test diga otra cosa.
const dia = '2026-09-29'

function estadoALas(hora: string, diaDeAhora = dia) {
  return estadoDeReserva(
    { estado: 'CONFIRMADA', asistio: null, dia, horaInicio: '20:00', horaFin: '21:00' },
    { dia: diaDeAhora, hora },
  )
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
    expect(
      estadoDeReserva(
        { estado: 'CONFIRMADA', asistio: null, dia, horaInicio: '23:00', horaFin: '00:00' },
        { dia, hora: '23:30' },
      ),
    ).toBe('EN_CURSO')
  })

  test('un turno de media hora transiciona igual que uno de una hora', () => {
    const turnoCorto = (hora: string) =>
      estadoDeReserva(
        { estado: 'CONFIRMADA', asistio: null, dia, horaInicio: '20:00', horaFin: '20:30' },
        { dia, hora },
      )

    expect(turnoCorto('20:00')).toBe('EN_CURSO')
    expect(turnoCorto('20:29')).toBe('EN_CURSO')
    expect(turnoCorto('20:30')).toBe('FINALIZADA')
  })

  test('el reloj no pisa los estados que decidió una persona', () => {
    expect(
      estadoDeReserva(
        { estado: 'CANCELADA', asistio: null, dia, horaInicio: '20:00', horaFin: '21:00' },
        { dia, hora: '20:30' },
      ),
    ).toBe('CANCELADA')
  })

  test('una pendiente con el turno terminado sigue pendiente', () => {
    expect(
      estadoDeReserva(
        { estado: 'PENDIENTE', asistio: null, dia, horaInicio: '20:00', horaFin: '21:00' },
        { dia, hora: '22:00' },
      ),
    ).toBe('PENDIENTE')
  })
})

describe('estadoDeReserva con la asistencia marcada', () => {
  function terminadaCon(asistio: boolean | null) {
    return estadoDeReserva(
      { estado: 'CONFIRMADA', asistio, dia, horaInicio: '20:00', horaFin: '21:00' },
      { dia, hora: '22:00' },
    )
  }

  test('terminado el turno, manda lo que marcó el dueño', () => {
    expect(terminadaCon(null)).toBe('FINALIZADA')
    expect(terminadaCon(true)).toBe('ASISTIO')
    expect(terminadaCon(false)).toBe('NO_SHOW')
  })

  test('la marca no adelanta el estado: primero tiene que terminar el turno', () => {
    const enCurso = estadoDeReserva(
      { estado: 'CONFIRMADA', asistio: false, dia, horaInicio: '20:00', horaFin: '21:00' },
      { dia, hora: '20:30' },
    )
    expect(enCurso).toBe('EN_CURSO')
  })

  test('una cancelada marcada como asistida sigue cancelada', () => {
    const cancelada = estadoDeReserva(
      { estado: 'CANCELADA', asistio: true, dia, horaInicio: '20:00', horaFin: '21:00' },
      { dia, hora: '22:00' },
    )
    expect(cancelada).toBe('CANCELADA')
  })
})
