import { describe, expect, test } from 'vitest'
import { searchCourtsSchema } from './court-search'

describe('searchCourtsSchema', () => {
  test('acepta todos los filtros bien formados', () => {
    const parsed = searchCourtsSchema.parse({
      zona: 'Palermo',
      deporte: 'PADEL',
      tipoSuperficie: 'CEMENTO',
      precioMin: '10000',
      precioMax: '30000',
    })
    expect(parsed).toEqual({
      zona: 'Palermo',
      deporte: 'PADEL',
      tipoSuperficie: 'CEMENTO',
      precioMin: 10000,
      precioMax: 30000,
    })
  })

  test('sin parámetros no filtra nada', () => {
    const parsed = searchCourtsSchema.parse({})
    expect(parsed.zona).toBeUndefined()
    expect(parsed.deporte).toBeUndefined()
    expect(parsed.tipoSuperficie).toBeUndefined()
    expect(parsed.precioMin).toBeUndefined()
    expect(parsed.precioMax).toBeUndefined()
  })

  test('los campos vacíos del formulario se ignoran (no filtran por precio 0)', () => {
    const parsed = searchCourtsSchema.parse({
      zona: '',
      deporte: '',
      tipoSuperficie: '',
      precioMin: '',
      precioMax: '',
    })
    expect(parsed.zona).toBeUndefined()
    expect(parsed.deporte).toBeUndefined()
    expect(parsed.tipoSuperficie).toBeUndefined()
    expect(parsed.precioMin).toBeUndefined()
    expect(parsed.precioMax).toBeUndefined()
  })

  test('un deporte o superficie que no existe se ignora en vez de romper', () => {
    const parsed = searchCourtsSchema.parse({ deporte: 'BASQUET', tipoSuperficie: 'LAVA' })
    expect(parsed.deporte).toBeUndefined()
    expect(parsed.tipoSuperficie).toBeUndefined()
  })

  test('un precio que no es un número se ignora', () => {
    const parsed = searchCourtsSchema.parse({ precioMin: 'barato', precioMax: '-5' })
    expect(parsed.precioMin).toBeUndefined()
    expect(parsed.precioMax).toBeUndefined()
  })

  test('un parámetro repetido en la URL (?zona=a&zona=b) se ignora', () => {
    const parsed = searchCourtsSchema.parse({ zona: ['Palermo', 'Belgrano'] })
    expect(parsed.zona).toBeUndefined()
  })
})

describe('searchCourtsSchema — fecha y horario', () => {
  test('acepta fecha con ventana horaria', () => {
    const parsed = searchCourtsSchema.parse({
      fecha: '2026-10-03',
      horaDesde: '18:00',
      horaHasta: '22:00',
    })
    expect(parsed.fecha).toBe('2026-10-03')
    expect(parsed.horaDesde).toBe('18:00')
    expect(parsed.horaHasta).toBe('22:00')
  })

  test('acepta la fecha sola, sin horario', () => {
    const parsed = searchCourtsSchema.parse({ fecha: '2026-10-03' })
    expect(parsed.fecha).toBe('2026-10-03')
    expect(parsed.horaDesde).toBeUndefined()
    expect(parsed.horaHasta).toBeUndefined()
  })

  test('acepta solo "desde" o solo "hasta" (ventana abierta del otro lado)', () => {
    const soloDesde = searchCourtsSchema.parse({ fecha: '2026-10-03', horaDesde: '18:00' })
    expect(soloDesde.horaDesde).toBe('18:00')
    expect(soloDesde.horaHasta).toBeUndefined()

    const soloHasta = searchCourtsSchema.parse({ fecha: '2026-10-03', horaHasta: '12:00' })
    expect(soloHasta.horaDesde).toBeUndefined()
    expect(soloHasta.horaHasta).toBe('12:00')
  })

  test('una fecha mal formada o que no existe se ignora', () => {
    expect(searchCourtsSchema.parse({ fecha: 'mañana' }).fecha).toBeUndefined()
    expect(searchCourtsSchema.parse({ fecha: '03/10/2026' }).fecha).toBeUndefined()
    expect(searchCourtsSchema.parse({ fecha: '2026-02-31' }).fecha).toBeUndefined()
    expect(searchCourtsSchema.parse({ fecha: '' }).fecha).toBeUndefined()
  })

  test('el horario sin fecha se ignora', () => {
    const parsed = searchCourtsSchema.parse({ horaDesde: '18:00', horaHasta: '22:00' })
    expect(parsed.horaDesde).toBeUndefined()
    expect(parsed.horaHasta).toBeUndefined()
  })

  test('una hora que no existe se ignora', () => {
    const parsed = searchCourtsSchema.parse({
      fecha: '2026-10-03',
      horaDesde: '25:00',
      horaHasta: '9:5',
    })
    expect(parsed.horaDesde).toBeUndefined()
    expect(parsed.horaHasta).toBeUndefined()
  })

  test('si "desde" no es anterior a "hasta" se ignora todo el horario', () => {
    const alReves = searchCourtsSchema.parse({
      fecha: '2026-10-03',
      horaDesde: '22:00',
      horaHasta: '18:00',
    })
    expect(alReves.fecha).toBe('2026-10-03')
    expect(alReves.horaDesde).toBeUndefined()
    expect(alReves.horaHasta).toBeUndefined()

    const iguales = searchCourtsSchema.parse({
      fecha: '2026-10-03',
      horaDesde: '18:00',
      horaHasta: '18:00',
    })
    expect(iguales.horaDesde).toBeUndefined()
    expect(iguales.horaHasta).toBeUndefined()
  })
})
