import { describe, expect, test } from 'vitest'
import {
  diaMasFuerte,
  familiaDelDeporte,
  franjasDelDia,
  horarioMasPedido,
  horarioMenosPedido,
  horariosDistintos,
  nivelDeDemanda,
  porcentaje,
  puntosDeLaCurva,
  reservasPorDia,
  reservasPorHorario,
  segmentosDeDona,
  sumarMetricas,
  temaDelDeporte,
  trazoDeLinea,
  trazoSuave,
  urlDelDashboard,
  variacionPorcentual,
} from './dashboard'

const demanda = [
  { diaSemana: 6, horaInicio: '21:00', reservas: 10 },
  { diaSemana: 6, horaInicio: '09:00', reservas: 2 },
  { diaSemana: 1, horaInicio: '15:00', reservas: 4 },
  { diaSemana: 1, horaInicio: '21:00', reservas: 6 },
]

describe('variacionPorcentual', () => {
  test('subió respecto del período anterior', () => {
    expect(variacionPorcentual(120, 100)).toBe(20)
  })

  test('bajó respecto del período anterior', () => {
    expect(variacionPorcentual(75, 100)).toBe(-25)
  })

  test('sin datos del período anterior no hay variación', () => {
    expect(variacionPorcentual(10, 0)).toBeNull()
  })
})

describe('porcentaje', () => {
  test('redondea al entero', () => {
    expect(porcentaje(1, 3)).toBe(33)
  })

  test('con total 0 da 0 en vez de dividir por cero', () => {
    expect(porcentaje(5, 0)).toBe(0)
  })
})

describe('horariosDistintos', () => {
  test('devuelve cada horario una vez y ordenado', () => {
    expect(horariosDistintos(demanda)).toEqual(['09:00', '15:00', '21:00'])
  })
})

describe('horarioMasPedido', () => {
  test('el de más reservas', () => {
    expect(horarioMasPedido(demanda)).toEqual({ diaSemana: 6, horaInicio: '21:00', reservas: 10 })
  })

  test('sin reservas no hay horario estrella', () => {
    expect(horarioMasPedido([])).toBeNull()
  })
})

describe('horarioMenosPedido', () => {
  const todaLaSemana = [0, 1, 2, 3, 4, 5, 6]

  test('cuenta los horarios sin reservas de la grilla', () => {
    // El domingo (0) no tiene ninguna reserva: su primer horario tiene 0
    expect(horarioMenosPedido(demanda, todaLaSemana)).toEqual({
      diaSemana: 0,
      horaInicio: '09:00',
      reservas: 0,
    })
  })

  test('solo busca en los días del período', () => {
    // Mirando solo el sábado (6), el horario más flojo es de ese día
    expect(horarioMenosPedido(demanda, [6])).toEqual({
      diaSemana: 6,
      horaInicio: '15:00',
      reservas: 0,
    })
  })

  test('sin demanda no hay grilla', () => {
    expect(horarioMenosPedido([], todaLaSemana)).toBeNull()
  })
})

describe('reservasPorDia', () => {
  test('suma las reservas de cada día de la semana', () => {
    expect(reservasPorDia(demanda)).toEqual([0, 10, 0, 0, 0, 0, 12])
  })
})

describe('diaMasFuerte', () => {
  test('el día con más reservas', () => {
    expect(diaMasFuerte(demanda)).toBe(6)
  })

  test('sin reservas no hay día más fuerte', () => {
    expect(diaMasFuerte([])).toBeNull()
  })
})

describe('reservasPorHorario', () => {
  test('suma las reservas de cada horario en el orden pedido', () => {
    expect(reservasPorHorario(demanda, ['09:00', '15:00', '21:00'])).toEqual([2, 4, 16])
  })
})

describe('franjasDelDia', () => {
  test('cuenta columnas y reservas de mañana (antes de 12), tarde (12 a 18) y noche', () => {
    expect(franjasDelDia(demanda, ['09:00', '15:00', '21:00'])).toEqual([
      { etiqueta: 'Mañana', columnas: 1, reservas: 2 },
      { etiqueta: 'Tarde', columnas: 1, reservas: 4 },
      { etiqueta: 'Noche', columnas: 1, reservas: 16 },
    ])
  })

  test('no devuelve las franjas sin horarios', () => {
    const soloNoche = [{ diaSemana: 1, horaInicio: '20:00', reservas: 3 }]
    expect(franjasDelDia(soloNoche, ['20:00'])).toEqual([
      { etiqueta: 'Noche', columnas: 1, reservas: 3 },
    ])
  })
})

describe('familiaDelDeporte y temaDelDeporte', () => {
  test('los tres fútbol son la misma familia', () => {
    expect(familiaDelDeporte('FUTBOL_5')).toBe('futbol')
    expect(familiaDelDeporte('FUTBOL_11')).toBe('futbol')
  })

  test('tenis y pádel son familias distintas', () => {
    expect(familiaDelDeporte('TENIS')).toBe('tenis')
    expect(familiaDelDeporte('PADEL')).toBe('padel')
  })

  test('sin deporte elegido el tema es el de todos', () => {
    expect(temaDelDeporte(undefined)).toBe('tema-todos')
    expect(temaDelDeporte('BASQUET')).toBe('tema-basquet')
  })
})

describe('nivelDeDemanda', () => {
  test('el máximo es el pico', () => {
    expect(nivelDeDemanda(10, 10)).toBe('pico')
  })

  test('alta, media y baja según la proporción', () => {
    expect(nivelDeDemanda(7, 10)).toBe('alta')
    expect(nivelDeDemanda(4, 10)).toBe('media')
    expect(nivelDeDemanda(2, 10)).toBe('baja')
  })

  test('sin reservas es baja (y no divide por cero)', () => {
    expect(nivelDeDemanda(0, 0)).toBe('baja')
  })
})

describe('puntosDeLaCurva y trazoDeLinea', () => {
  test('reparte los puntos a lo ancho y el máximo toca el techo', () => {
    expect(puntosDeLaCurva([0, 5, 10], 100, 50, 10)).toEqual([
      { x: 0, y: 50 },
      { x: 50, y: 25 },
      { x: 100, y: 0 },
    ])
  })

  test('con máximo 0 todo queda en el piso', () => {
    expect(puntosDeLaCurva([0, 0], 100, 50, 0)).toEqual([
      { x: 0, y: 50 },
      { x: 100, y: 50 },
    ])
  })

  test('arma el atributo d del path', () => {
    expect(
      trazoDeLinea([
        { x: 0, y: 50 },
        { x: 100, y: 0 },
      ]),
    ).toBe('M0.0 50.0 L100.0 0.0')
  })
})

describe('segmentosDeDona', () => {
  test('cada parte mide su proporción menos la separación', () => {
    expect(segmentosDeDona([1, 3], 100, 2)).toEqual([
      { largo: 23, inicio: 0 },
      { largo: 73, inicio: 25 },
    ])
  })

  test('una parte en 0 no tiene largo negativo', () => {
    expect(segmentosDeDona([0, 4], 100, 2)).toEqual([
      { largo: 0, inicio: 0 },
      { largo: 98, inicio: 0 },
    ])
  })
})

describe('sumarMetricas', () => {
  const complejoChico = {
    ocupacion: { turnosReservados: 1, turnosOfrecidos: 10, porcentaje: 10 },
    ingresos: 500,
    cancelaciones: 1,
    noShows: 0,
    demanda: [{ diaSemana: 1, horaInicio: '20:00', reservas: 1 }],
  }
  const complejoGrande = {
    ocupacion: { turnosReservados: 90, turnosOfrecidos: 100, porcentaje: 90 },
    ingresos: 45000,
    cancelaciones: 3,
    noShows: 2,
    demanda: [
      { diaSemana: 1, horaInicio: '20:00', reservas: 50 },
      { diaSemana: 6, horaInicio: '10:00', reservas: 40 },
    ],
  }

  test('suma los totales y recalcula la ocupación con ellos (no promedia %)', () => {
    const total = sumarMetricas([complejoChico, complejoGrande])
    // 91 de 110 = 83%, no el promedio de 10% y 90% (50%)
    expect(total.ocupacion).toEqual({ turnosReservados: 91, turnosOfrecidos: 110, porcentaje: 83 })
    expect(total.ingresos).toBe(45500)
    expect(total.cancelaciones).toBe(4)
    expect(total.noShows).toBe(2)
  })

  test('junta la demanda del mismo día y hora', () => {
    const total = sumarMetricas([complejoChico, complejoGrande])
    expect(total.demanda).toEqual([
      { diaSemana: 1, horaInicio: '20:00', reservas: 51 },
      { diaSemana: 6, horaInicio: '10:00', reservas: 40 },
    ])
  })

  test('no modifica las métricas que recibe', () => {
    sumarMetricas([complejoChico, complejoGrande])
    expect(complejoChico.demanda[0].reservas).toBe(1)
  })

  test('sin nada para sumar da todo en 0', () => {
    expect(sumarMetricas([]).ocupacion.porcentaje).toBe(0)
  })
})

describe('trazoSuave', () => {
  const puntos = [
    { x: 0, y: 100 },
    { x: 50, y: 0 },
    { x: 100, y: 100 },
  ]

  test('arranca en el primer punto y pasa por todos (cada curva termina en uno)', () => {
    const trazo = trazoSuave(puntos, 100)
    expect(trazo.startsWith('M0.0 100.0')).toBe(true)
    expect(trazo).toContain(' 50.0 0.0 C')
    expect(trazo.endsWith(' 100.0 100.0')).toBe(true)
  })

  test('una curva por cada par de puntos', () => {
    expect(trazoSuave(puntos, 100).split('C').length - 1).toBe(2)
  })

  test('los controles no bajan del piso ni suben del techo', () => {
    const trazo = trazoSuave(puntos, 100)
    const numeros = trazo.replace(/[MC]/g, ' ').trim().split(/\s+/).map(Number)
    for (let i = 1; i < numeros.length; i += 2) {
      expect(numeros[i]).toBeGreaterThanOrEqual(0)
      expect(numeros[i]).toBeLessThanOrEqual(100)
    }
  })

  test('con menos de tres puntos es una línea recta', () => {
    expect(
      trazoSuave(
        [
          { x: 0, y: 50 },
          { x: 100, y: 0 },
        ],
        100,
      ),
    ).toBe('M0.0 50.0 L100.0 0.0')
  })
})

describe('urlDelDashboard', () => {
  test('solo la vista: todos los complejos, hoy y todos los deportes', () => {
    expect(urlDelDashboard({ vista: 'dia' })).toBe('/dueno/dashboard?vista=dia')
  })

  test('con todos los filtros', () => {
    expect(
      urlDelDashboard({ complejoId: 'abc', vista: 'mes', fecha: '2026-09-01', deporte: 'PADEL' }),
    ).toBe('/dueno/dashboard?complejoId=abc&vista=mes&fecha=2026-09-01&deporte=PADEL')
  })
})
