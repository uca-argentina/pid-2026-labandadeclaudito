import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  esDiaReal,
  franjaDentroDelHorario,
  formatAdvanceTime,
  generateSlots,
  horariosSeSuperponen,
  isTooSoonToBook,
  minutesToTimeText,
  refundsDeposit,
  sumarMinutos,
  timeTextToMinutes,
  turnoYaPaso,
  ultimoDiaParaReservar,
} from './time'

describe('generateSlots', () => {
  test('genera turnos de 60 minutos entre apertura y cierre', () => {
    const slots = generateSlots('08:00', '10:00', 60)
    expect(slots).toEqual([
      { horaInicio: '08:00', horaFin: '09:00' },
      { horaInicio: '09:00', horaFin: '10:00' },
    ])
  })

  test('cuando sobra tiempo pero no alcanza para un turno completo, agrega uno más corto con el resto', () => {
    const slots = generateSlots('08:00', '09:30', 60)
    expect(slots).toEqual([
      { horaInicio: '08:00', horaFin: '09:00' },
      { horaInicio: '09:00', horaFin: '09:30' },
    ])
  })

  test('con 90 minutos de turno en una ventana de 8 a 12, aprovecha el resto como un tercer turno más corto', () => {
    const slots = generateSlots('08:00', '12:00', 90)
    expect(slots).toEqual([
      { horaInicio: '08:00', horaFin: '09:30' },
      { horaInicio: '09:30', horaFin: '11:00' },
      { horaInicio: '11:00', horaFin: '12:00' },
    ])
  })

  test('de 08:00 a 00:00 (medianoche) se entiende como "hasta el final del día", no como una ventana vacía', () => {
    const slots = generateSlots('08:00', '00:00', 90)
    expect(slots).toEqual([
      { horaInicio: '08:00', horaFin: '09:30' },
      { horaInicio: '09:30', horaFin: '11:00' },
      { horaInicio: '11:00', horaFin: '12:30' },
      { horaInicio: '12:30', horaFin: '14:00' },
      { horaInicio: '14:00', horaFin: '15:30' },
      { horaInicio: '15:30', horaFin: '17:00' },
      { horaInicio: '17:00', horaFin: '18:30' },
      { horaInicio: '18:30', horaFin: '20:00' },
      { horaInicio: '20:00', horaFin: '21:30' },
      { horaInicio: '21:30', horaFin: '23:00' },
      { horaInicio: '23:00', horaFin: '00:00' },
    ])
  })

  test('cuando cierra después de medianoche, genera los turnos de la madrugada y los de la noche sin turno parcial de más', () => {
    const slots = generateSlots('20:00', '03:00', 60)
    expect(slots).toEqual([
      { horaInicio: '00:00', horaFin: '01:00' },
      { horaInicio: '01:00', horaFin: '02:00' },
      { horaInicio: '02:00', horaFin: '03:00' },
      { horaInicio: '20:00', horaFin: '21:00' },
      { horaInicio: '21:00', horaFin: '22:00' },
      { horaInicio: '22:00', horaFin: '23:00' },
      { horaInicio: '23:00', horaFin: '00:00' },
    ])
  })

  test('cuando abre y cierra a la misma hora, lo trata como abierto las 24hs', () => {
    const slots = generateSlots('08:00', '08:00', 60 * 4)
    expect(slots).toEqual([
      { horaInicio: '00:00', horaFin: '04:00' },
      { horaInicio: '04:00', horaFin: '08:00' },
      { horaInicio: '08:00', horaFin: '12:00' },
      { horaInicio: '12:00', horaFin: '16:00' },
      { horaInicio: '16:00', horaFin: '20:00' },
      { horaInicio: '20:00', horaFin: '00:00' },
    ])
  })
})

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

describe('horariosSeSuperponen', () => {
  test('mismo horario se superpone', () => {
    expect(horariosSeSuperponen('10:00', '11:00', '10:00', '11:00')).toBe(true)
  })

  test('turnos de distinta duración que se cruzan', () => {
    expect(horariosSeSuperponen('10:00', '11:30', '11:00', '12:00')).toBe(true)
  })

  test('turnos pegados no se superponen', () => {
    expect(horariosSeSuperponen('10:00', '11:00', '11:00', '12:00')).toBe(false)
  })

  test('un turno que termina a medianoche', () => {
    expect(horariosSeSuperponen('23:00', '00:00', '23:30', '00:00')).toBe(true)
    expect(horariosSeSuperponen('22:00', '23:00', '23:00', '00:00')).toBe(false)
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

describe('anticipación con input HH:MM', () => {
  test('pasa HH:MM a minutos', () => {
    expect(timeTextToMinutes('03:00')).toBe(180)
    expect(timeTextToMinutes('01:30')).toBe(90)
    expect(timeTextToMinutes('00:45')).toBe(45)
  })

  test('input vacío es null', () => {
    expect(timeTextToMinutes('')).toBeNull()
  })

  test('pasa minutos a HH:MM para precargar el input', () => {
    expect(minutesToTimeText(180)).toBe('03:00')
    expect(minutesToTimeText(90)).toBe('01:30')
    expect(minutesToTimeText(0)).toBe('00:00')
  })

  test('formatea para mostrar', () => {
    expect(formatAdvanceTime(180)).toBe('3 h')
    expect(formatAdvanceTime(90)).toBe('1 h 30 min')
    expect(formatAdvanceTime(45)).toBe('45 min')
  })
})

describe('isTooSoonToBook', () => {
  // 16:00 UTC = 13:00 en Argentina.
  const alMediodia = new Date('2026-09-16T16:00:00Z')

  test('sin anticipación solo bloquea lo que ya pasó', () => {
    expect(isTooSoonToBook('2026-09-16', '12:00', 0, alMediodia)).toBe(true)
    expect(isTooSoonToBook('2026-09-16', '13:00', 0, alMediodia)).toBe(false)
  })

  test('con 120 minutos bloquea los turnos de las próximas 2 horas', () => {
    expect(isTooSoonToBook('2026-09-16', '14:00', 120, alMediodia)).toBe(true)
    expect(isTooSoonToBook('2026-09-16', '15:00', 120, alMediodia)).toBe(false)
    expect(isTooSoonToBook('2026-09-16', '16:00', 120, alMediodia)).toBe(false)
  })

  test('el límite puede caer al día siguiente', () => {
    // 02:00 UTC del 17 = 23:00 del 16 en Argentina. Límite: 01:00 del 17.
    const deNoche = new Date('2026-09-17T02:00:00Z')
    expect(isTooSoonToBook('2026-09-16', '23:30', 120, deNoche)).toBe(true)
    expect(isTooSoonToBook('2026-09-17', '00:30', 120, deNoche)).toBe(true)
    expect(isTooSoonToBook('2026-09-17', '01:30', 120, deNoche)).toBe(false)
  })
})

describe('refundsDeposit', () => {
  // 16:00 UTC = 13:00 en Argentina del 16.
  const alMediodia = new Date('2026-09-16T16:00:00Z')

  test('con 24 hs: devuelve si faltan 24 hs o más', () => {
    expect(refundsDeposit('2026-09-17', '13:00', 24, 24, alMediodia)).toBe(true)
    expect(refundsDeposit('2026-09-17', '14:00', 24, 24, alMediodia)).toBe(true)
    expect(refundsDeposit('2026-09-17', '12:00', 24, 24, alMediodia)).toBe(false)
    expect(refundsDeposit('2026-09-16', '20:00', 24, 24, alMediodia)).toBe(false)
  })

  test('si el complejo subió a 48 hs, vale la de 24 con la que pagó', () => {
    // Faltan 30 hs: con 48 no se devolvería, con 24 sí.
    expect(refundsDeposit('2026-09-17', '19:00', 24, 48, alMediodia)).toBe(true)
  })

  test('si el complejo bajó a 12 hs, el jugador aprovecha la nueva', () => {
    // Faltan 15 hs: con 24 no se devolvería, con 12 sí.
    expect(refundsDeposit('2026-09-17', '04:00', 24, 12, alMediodia)).toBe(true)
    // Faltan 10 hs: no alcanza ni con 12.
    expect(refundsDeposit('2026-09-16', '23:00', 24, 12, alMediodia)).toBe(false)
  })

  test('el límite puede caer al día siguiente', () => {
    // 02:00 UTC del 17 = 23:00 del 16 en Argentina. Con 4 hs, límite: 03:00 del 17.
    const deNoche = new Date('2026-09-17T02:00:00Z')
    expect(refundsDeposit('2026-09-17', '02:00', 4, 4, deNoche)).toBe(false)
    expect(refundsDeposit('2026-09-17', '03:00', 4, 4, deNoche)).toBe(true)
  })
})

describe('esDiaReal', () => {
  test('acepta un día que existe, incluido el 29 de febrero de un año bisiesto', () => {
    expect(esDiaReal('2026-11-30')).toBe(true)
    expect(esDiaReal('2028-02-29')).toBe(true)
  })

  test('rechaza días que no existen aunque tengan formato de fecha', () => {
    expect(esDiaReal('2026-11-31')).toBe(false)
    expect(esDiaReal('2026-02-29')).toBe(false)
    expect(esDiaReal('2026-1-05')).toBe(false)
  })
})

describe('franjaDentroDelHorario', () => {
  test('cancha de 08 a 23: adentro sí, afuera o pisando el borde no', () => {
    expect(franjaDentroDelHorario('08:00', '23:00', '08:00', '23:00')).toBe(true)
    expect(franjaDentroDelHorario('19:00', '22:00', '08:00', '23:00')).toBe(true)
    expect(franjaDentroDelHorario('05:00', '07:00', '08:00', '23:00')).toBe(false)
    expect(franjaDentroDelHorario('07:00', '09:00', '08:00', '23:00')).toBe(false)
    expect(franjaDentroDelHorario('22:00', '23:30', '08:00', '23:00')).toBe(false)
  })

  test('cancha que cierra a medianoche (08 a 00): vale hasta 23:59', () => {
    expect(franjaDentroDelHorario('22:00', '23:59', '08:00', '00:00')).toBe(true)
    expect(franjaDentroDelHorario('06:00', '09:00', '08:00', '00:00')).toBe(false)
  })

  test('cancha que cruza medianoche (20 a 03): cualquiera de los dos tramos', () => {
    expect(franjaDentroDelHorario('21:00', '23:00', '20:00', '03:00')).toBe(true)
    expect(franjaDentroDelHorario('00:00', '03:00', '20:00', '03:00')).toBe(true)
    expect(franjaDentroDelHorario('02:00', '04:00', '20:00', '03:00')).toBe(false)
    expect(franjaDentroDelHorario('10:00', '12:00', '20:00', '03:00')).toBe(false)
    // Pisa los dos tramos y el hueco del medio, en que la cancha está cerrada
    expect(franjaDentroDelHorario('01:00', '21:00', '20:00', '03:00')).toBe(false)
  })
})

describe('ultimoDiaParaReservar', () => {
  test('30 días después de hoy', () => {
    expect(ultimoDiaParaReservar('2026-10-07')).toBe('2026-11-06')
  })

  test('cruza fin de año', () => {
    expect(ultimoDiaParaReservar('2026-12-15')).toBe('2027-01-14')
  })
})
