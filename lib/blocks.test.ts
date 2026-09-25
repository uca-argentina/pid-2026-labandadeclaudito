import { describe, expect, it } from 'vitest'
import { blockOverlapsBooking, blocksOverlap, isSlotBlocked } from './blocks'

describe('blocksOverlap', () => {
  it('se solapan cuando comparten día y horario', () => {
    const a = {
      startDate: '2026-10-01',
      endDate: '2026-10-01',
      startTime: '10:00',
      endTime: '12:00',
    }
    const b = {
      startDate: '2026-10-01',
      endDate: '2026-10-01',
      startTime: '11:00',
      endTime: '13:00',
    }
    expect(blocksOverlap(a, b)).toBe(true)
  })

  it('no se solapan cuando un horario termina justo cuando empieza el otro', () => {
    const a = {
      startDate: '2026-10-01',
      endDate: '2026-10-01',
      startTime: '10:00',
      endTime: '12:00',
    }
    const b = {
      startDate: '2026-10-01',
      endDate: '2026-10-01',
      startTime: '12:00',
      endTime: '14:00',
    }
    expect(blocksOverlap(a, b)).toBe(false)
  })

  it('no se solapan cuando los rangos de fecha no se tocan', () => {
    const a = {
      startDate: '2026-10-01',
      endDate: '2026-10-02',
      startTime: '10:00',
      endTime: '12:00',
    }
    const b = {
      startDate: '2026-10-05',
      endDate: '2026-10-06',
      startTime: '10:00',
      endTime: '12:00',
    }
    expect(blocksOverlap(a, b)).toBe(false)
  })

  it('se solapan cuando los rangos de fecha se cruzan aunque no coincidan los extremos', () => {
    const a = {
      startDate: '2026-10-01',
      endDate: '2026-10-10',
      startTime: '10:00',
      endTime: '12:00',
    }
    const b = {
      startDate: '2026-10-05',
      endDate: '2026-10-06',
      startTime: '10:00',
      endTime: '12:00',
    }
    expect(blocksOverlap(a, b)).toBe(true)
  })

  it('no se solapan cuando las fechas coinciden pero el horario no', () => {
    const a = {
      startDate: '2026-10-01',
      endDate: '2026-10-01',
      startTime: '08:00',
      endTime: '10:00',
    }
    const b = {
      startDate: '2026-10-01',
      endDate: '2026-10-01',
      startTime: '10:00',
      endTime: '12:00',
    }
    expect(blocksOverlap(a, b)).toBe(false)
  })
})

describe('blockOverlapsBooking', () => {
  it('se solapan cuando la fecha de la reserva cae dentro del rango del bloqueo y el horario coincide', () => {
    const block = {
      startDate: '2026-10-01',
      endDate: '2026-10-05',
      startTime: '14:00',
      endTime: '18:00',
    }
    const booking = { date: '2026-10-03', startTime: '15:00', endTime: '16:00' }
    expect(blockOverlapsBooking(block, booking)).toBe(true)
  })

  it('no se solapan cuando la fecha de la reserva queda fuera del rango del bloqueo', () => {
    const block = {
      startDate: '2026-10-01',
      endDate: '2026-10-05',
      startTime: '14:00',
      endTime: '18:00',
    }
    const booking = { date: '2026-10-06', startTime: '15:00', endTime: '16:00' }
    expect(blockOverlapsBooking(block, booking)).toBe(false)
  })

  it('no se solapan cuando la fecha coincide pero el horario de la reserva es anterior al bloqueo', () => {
    const block = {
      startDate: '2026-10-01',
      endDate: '2026-10-05',
      startTime: '14:00',
      endTime: '18:00',
    }
    const booking = { date: '2026-10-03', startTime: '08:00', endTime: '09:00' }
    expect(blockOverlapsBooking(block, booking)).toBe(false)
  })

  it('se solapan cuando la reserva empieza antes y termina dentro del bloqueo', () => {
    const block = {
      startDate: '2026-10-01',
      endDate: '2026-10-01',
      startTime: '14:00',
      endTime: '18:00',
    }
    const booking = { date: '2026-10-01', startTime: '13:00', endTime: '15:00' }
    expect(blockOverlapsBooking(block, booking)).toBe(true)
  })

  it('se solapan cuando la reserva termina a medianoche (endTime 00:00) y el bloqueo cubre esa hora', () => {
    const block = {
      startDate: '2026-10-01',
      endDate: '2026-10-01',
      startTime: '22:00',
      endTime: '23:59',
    }
    const booking = { date: '2026-10-01', startTime: '23:00', endTime: '00:00' }
    expect(blockOverlapsBooking(block, booking)).toBe(true)
  })
})

describe('isSlotBlocked', () => {
  const bloqueoDeTarde = [{ startTime: '14:00', endTime: '18:00' }]

  it('un turno dentro del horario del bloqueo está bloqueado', () => {
    expect(isSlotBlocked('15:00', 60, bloqueoDeTarde)).toBe(true)
  })

  it('un turno que empieza antes y termina dentro del bloqueo está bloqueado', () => {
    expect(isSlotBlocked('13:30', 60, bloqueoDeTarde)).toBe(true)
  })

  it('un turno que termina justo cuando empieza el bloqueo no está bloqueado', () => {
    expect(isSlotBlocked('13:00', 60, bloqueoDeTarde)).toBe(false)
  })

  it('un turno que empieza justo cuando termina el bloqueo no está bloqueado', () => {
    expect(isSlotBlocked('18:00', 60, bloqueoDeTarde)).toBe(false)
  })

  it('sin bloqueos ningún turno está bloqueado', () => {
    expect(isSlotBlocked('15:00', 60, [])).toBe(false)
  })

  it('el turno de las 23:00 (termina a medianoche) se bloquea si el bloqueo llega hasta las 23:59', () => {
    const bloqueoDeNoche = [{ startTime: '22:00', endTime: '23:59' }]
    expect(isSlotBlocked('23:00', 60, bloqueoDeNoche)).toBe(true)
  })
})
