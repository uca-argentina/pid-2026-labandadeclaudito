import { afterEach, describe, expect, test, vi } from 'vitest'
import { sumarMinutos, turnoYaPaso } from './time'

afterEach(() => {
  vi.useRealTimers()
})

describe('sumarMinutos', () => {
  test('suma la duración del turno', () => {
    expect(sumarMinutos('10:00', 60)).toBe('11:00')
    expect(sumarMinutos('10:30', 90)).toBe('12:00')
  })

  test('da la vuelta a medianoche', () => {
    expect(sumarMinutos('23:30', 60)).toBe('00:30')
  })
})

describe('turnoYaPaso', () => {
  // 18:00 UTC = 15:00 en Argentina.
  function fijarAhora(instante: string) {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(instante))
  }

  test('un día anterior ya pasó', () => {
    fijarAhora('2026-09-16T18:00:00Z')
    expect(turnoYaPaso('2026-09-15', '23:00')).toBe(true)
  })

  test('un día posterior no pasó', () => {
    fijarAhora('2026-09-16T18:00:00Z')
    expect(turnoYaPaso('2026-09-17', '00:00')).toBe(false)
  })

  test('hoy compara la hora', () => {
    fijarAhora('2026-09-16T18:00:00Z')
    expect(turnoYaPaso('2026-09-16', '14:00')).toBe(true)
    expect(turnoYaPaso('2026-09-16', '16:00')).toBe(false)
  })

  test('de noche sigue siendo el mismo día en Argentina', () => {
    // 02:00 UTC del 17 = 23:00 del 16 en Argentina.
    fijarAhora('2026-09-17T02:00:00Z')
    expect(turnoYaPaso('2026-09-16', '23:30')).toBe(false)
    expect(turnoYaPaso('2026-09-16', '22:00')).toBe(true)
  })
})
