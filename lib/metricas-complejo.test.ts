import { describe, expect, test } from 'vitest'
import { contarTurnosOfrecidos, diasDelRango, horariosDeMayorDemanda } from './metricas-complejo'

// 08:00 a 12:00 con turnos de 60 min = 4 turnos por día
const cancha = { horaApertura: '08:00', horaCierre: '12:00', duracionTurnoMin: 60 }

describe('diasDelRango', () => {
  test('incluye el primer y el último día, y cruza de mes', () => {
    expect(diasDelRango('2026-10-30', '2026-11-02')).toEqual([
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
      '2026-11-02',
    ])
  })

  test('hasta antes que desde: no hay días', () => {
    expect(diasDelRango('2026-10-05', '2026-10-04')).toEqual([])
  })
})

describe('contarTurnosOfrecidos', () => {
  test('sin bloqueos: turnos por día × días', () => {
    expect(contarTurnosOfrecidos(cancha, ['2026-10-05', '2026-10-06'], [])).toBe(8)
  })

  test('un bloqueo resta solo los turnos que pisa, en los días que cubre', () => {
    const bloqueo = {
      startDate: '2026-10-05',
      endDate: '2026-10-05',
      startTime: '09:00',
      endTime: '11:00',
    }
    // el 5 pierde 09:00 y 10:00; el 6 queda entero
    expect(contarTurnosOfrecidos(cancha, ['2026-10-05', '2026-10-06'], [bloqueo])).toBe(6)
  })
})

describe('horariosDeMayorDemanda', () => {
  test('agrupa por día de semana y hora, del más pedido al menos', () => {
    // 2026-10-05 y 2026-10-12 son lunes (1); 2026-10-06 es martes (2)
    const reservas = [
      { fecha: new Date('2026-10-06'), horaInicio: '20:00' },
      { fecha: new Date('2026-10-05'), horaInicio: '20:00' },
      { fecha: new Date('2026-10-12'), horaInicio: '20:00' },
      { fecha: new Date('2026-10-05'), horaInicio: '18:00' },
    ]
    expect(horariosDeMayorDemanda(reservas)).toEqual([
      { diaSemana: 1, horaInicio: '20:00', reservas: 2 },
      { diaSemana: 2, horaInicio: '20:00', reservas: 1 },
      { diaSemana: 1, horaInicio: '18:00', reservas: 1 },
    ])
  })
})
