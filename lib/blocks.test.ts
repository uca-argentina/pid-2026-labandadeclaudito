import { describe, expect, it } from 'vitest'
import {
  blockOverlapsBooking,
  blocksOverlap,
  isSlotBlocked,
  resumenBloqueosDelComplejo,
  textoDelBloqueo,
} from './blocks'

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
    expect(isSlotBlocked('15:00', '16:00', bloqueoDeTarde)).toBe(true)
  })

  it('un turno que empieza antes y termina dentro del bloqueo está bloqueado', () => {
    expect(isSlotBlocked('13:30', '14:30', bloqueoDeTarde)).toBe(true)
  })

  it('un turno que termina justo cuando empieza el bloqueo no está bloqueado', () => {
    expect(isSlotBlocked('13:00', '14:00', bloqueoDeTarde)).toBe(false)
  })

  it('un turno que empieza justo cuando termina el bloqueo no está bloqueado', () => {
    expect(isSlotBlocked('18:00', '19:00', bloqueoDeTarde)).toBe(false)
  })

  it('sin bloqueos ningún turno está bloqueado', () => {
    expect(isSlotBlocked('15:00', '16:00', [])).toBe(false)
  })

  it('el turno de las 23:00 (termina a medianoche) se bloquea si el bloqueo llega hasta las 23:59', () => {
    const bloqueoDeNoche = [{ startTime: '22:00', endTime: '23:59' }]
    expect(isSlotBlocked('23:00', '00:00', bloqueoDeNoche)).toBe(true)
  })
})

describe('textoDelBloqueo', () => {
  const mantenimiento = { startTime: '14:00', endTime: '18:00', reason: 'Mantenimiento' }

  it('al jugador le muestra solo la franja, nunca el motivo', () => {
    expect(textoDelBloqueo([mantenimiento], false)).toBe('Bloqueada de 14:00 a 18:00')
  })

  it('al dueño le suma el motivo', () => {
    expect(textoDelBloqueo([mantenimiento], true)).toBe(
      'Bloqueada de 14:00 a 18:00 · Mantenimiento',
    )
  })

  it('sin motivo cargado, solo la franja aunque sea el dueño', () => {
    expect(textoDelBloqueo([{ startTime: '08:00', endTime: '10:00', reason: null }], true)).toBe(
      'Bloqueada de 08:00 a 10:00',
    )
  })

  it('varios bloqueos el mismo día: junta las franjas y los motivos', () => {
    const torneo = { startTime: '08:00', endTime: '10:00', reason: 'Torneo' }
    expect(textoDelBloqueo([torneo, mantenimiento], true)).toBe(
      'Bloqueada de 08:00 a 10:00 y de 14:00 a 18:00 · Torneo, Mantenimiento',
    )
  })
})

describe('resumenBloqueosDelComplejo', () => {
  it('sin canchas bloqueadas, nada', () => {
    expect(resumenBloqueosDelComplejo(0, 3)).toBeNull()
  })

  it('una de varias', () => {
    expect(resumenBloqueosDelComplejo(1, 3)).toBe('1 de 3 canchas bloqueada')
  })

  it('varias de varias', () => {
    expect(resumenBloqueosDelComplejo(2, 3)).toBe('2 de 3 canchas bloqueadas')
  })

  it('todas', () => {
    expect(resumenBloqueosDelComplejo(3, 3)).toBe('Todas las canchas bloqueadas')
  })
})
