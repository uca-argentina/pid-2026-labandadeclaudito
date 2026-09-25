import { describe, expect, test } from 'vitest'
import { activeFilterChips, filtersToQueryString, matchingSlots } from './court-search'

describe('filtersToQueryString', () => {
  test('sin filtros devuelve texto vacío', () => {
    expect(filtersToQueryString({})).toBe('')
  })

  test('arma la query con los filtros que hay, en orden fijo', () => {
    const query = filtersToQueryString({
      zona: 'Palermo',
      deporte: 'FUTBOL_11',
      tipoSuperficie: 'CESPED_SINTETICO',
      precioMin: 10000,
      precioMax: 30000,
    })
    expect(query).toBe(
      '?zona=Palermo&deporte=FUTBOL_11&tipoSuperficie=CESPED_SINTETICO&precioMin=10000&precioMax=30000',
    )
  })

  test('deja afuera los filtros que no se usaron', () => {
    expect(filtersToQueryString({ deporte: 'PADEL' })).toBe('?deporte=PADEL')
  })

  test('escapa los caracteres especiales de la zona', () => {
    expect(filtersToQueryString({ zona: 'Villa Crespo & Almagro' })).toBe(
      '?zona=Villa+Crespo+%26+Almagro',
    )
  })

  test('un precio mínimo de 0 se conserva', () => {
    expect(filtersToQueryString({ precioMin: 0 })).toBe('?precioMin=0')
  })
})

describe('matchingSlots', () => {
  // Cancha de 08 a 12 con turnos de 1 hora, con un precio especial a las 11
  const turnos = [
    { horaInicio: '08:00', disponible: true, precio: 10000 },
    { horaInicio: '09:00', disponible: false, precio: 10000 },
    { horaInicio: '10:00', disponible: true, precio: 10000 },
    { horaInicio: '11:00', disponible: true, precio: 5000 },
  ]

  function horas(slots: { horaInicio: string }[]) {
    return slots.map((slot) => slot.horaInicio)
  }

  test('sin filtros devuelve todos los turnos libres', () => {
    expect(horas(matchingSlots(turnos, {}))).toEqual(['08:00', '10:00', '11:00'])
  })

  test('nunca devuelve un turno ocupado, aunque esté dentro de la ventana', () => {
    expect(horas(matchingSlots(turnos, { horaDesde: '09:00', horaHasta: '10:00' }))).toEqual([])
  })

  test('"desde" incluye el turno que empieza justo a esa hora', () => {
    expect(horas(matchingSlots(turnos, { horaDesde: '10:00' }))).toEqual(['10:00', '11:00'])
  })

  test('"hasta" no incluye el turno que empieza justo a esa hora', () => {
    expect(horas(matchingSlots(turnos, { horaHasta: '10:00' }))).toEqual(['08:00'])
  })

  test('la ventana combina desde y hasta', () => {
    expect(horas(matchingSlots(turnos, { horaDesde: '08:00', horaHasta: '11:00' }))).toEqual([
      '08:00',
      '10:00',
    ])
  })

  test('el precio mínimo y el máximo se incluyen a sí mismos', () => {
    expect(horas(matchingSlots(turnos, { precioMin: 10000 }))).toEqual(['08:00', '10:00'])
    expect(horas(matchingSlots(turnos, { precioMax: 5000 }))).toEqual(['11:00'])
  })

  test('ventana y precio se combinan sobre el mismo turno', () => {
    // A las 11 hay un turno barato, pero la ventana termina a las 11
    expect(horas(matchingSlots(turnos, { horaHasta: '11:00', precioMax: 5000 }))).toEqual([])
  })

  test('si ningún turno cumple devuelve una lista vacía', () => {
    expect(matchingSlots(turnos, { precioMin: 50000 })).toEqual([])
  })
})

describe('filtersToQueryString — fecha y horario', () => {
  test('incluye la fecha y la ventana horaria', () => {
    const query = filtersToQueryString({
      fecha: '2026-10-03',
      horaDesde: '18:00',
      horaHasta: '22:00',
    })
    expect(query).toBe('?fecha=2026-10-03&horaDesde=18%3A00&horaHasta=22%3A00')
  })

  test('la fecha sola no agrega horario', () => {
    expect(filtersToQueryString({ fecha: '2026-10-03' })).toBe('?fecha=2026-10-03')
  })
})

describe('activeFilterChips', () => {
  function textos(filtros: Parameters<typeof activeFilterChips>[0]) {
    return activeFilterChips(filtros).map((chip) => chip.label)
  }

  test('sin filtros no hay chips', () => {
    expect(activeFilterChips({})).toEqual([])
  })

  test('zona, deporte y superficie se muestran con su nombre legible', () => {
    expect(
      textos({ zona: 'Palermo', deporte: 'FUTBOL_11', tipoSuperficie: 'CESPED_SINTETICO' }),
    ).toEqual(['Zona: Palermo', 'Deporte: Fútbol 11', 'Superficie: Césped sintético'])
  })

  test('el precio mínimo y el máximo son chips separados', () => {
    expect(textos({ precioMin: 10000, precioMax: 30000 })).toEqual([
      'Precio mínimo: $10.000',
      'Precio máximo: $30.000',
    ])
  })

  test('la fecha se muestra como día/mes/año', () => {
    expect(textos({ fecha: '2026-10-03' })).toEqual(['Fecha: 03/10/2026'])
  })

  test('el horario es un solo chip, con ventana completa o abierta de un lado', () => {
    const fecha = '2026-10-03'
    expect(textos({ fecha, horaDesde: '18:00', horaHasta: '22:00' })).toEqual([
      'Fecha: 03/10/2026',
      'Horario: 18:00 a 22:00',
    ])
    expect(textos({ fecha, horaDesde: '18:00' })).toEqual([
      'Fecha: 03/10/2026',
      'Horario: desde 18:00',
    ])
    expect(textos({ fecha, horaHasta: '12:00' })).toEqual([
      'Fecha: 03/10/2026',
      'Horario: hasta 12:00',
    ])
  })

  test('quitar un chip deja todos los otros filtros', () => {
    const filtros = { zona: 'Palermo', deporte: 'PADEL' as const, precioMax: 30000 }
    const chipDeDeporte = activeFilterChips(filtros)[1]
    expect(chipDeDeporte.withoutIt).toEqual({ zona: 'Palermo', precioMax: 30000 })
  })

  test('quitar el chip de fecha también quita el horario, que sin fecha no significa nada', () => {
    const filtros = { fecha: '2026-10-03', horaDesde: '18:00', horaHasta: '22:00', zona: 'Palermo' }
    const chipDeFecha = activeFilterChips(filtros)[1]
    expect(chipDeFecha.label).toBe('Fecha: 03/10/2026')
    expect(chipDeFecha.withoutIt).toEqual({ zona: 'Palermo' })
  })

  test('quitar el chip de horario deja la fecha', () => {
    const filtros = { fecha: '2026-10-03', horaDesde: '18:00', horaHasta: '22:00' }
    const chipDeHorario = activeFilterChips(filtros)[1]
    expect(chipDeHorario.withoutIt).toEqual({ fecha: '2026-10-03' })
  })
})
