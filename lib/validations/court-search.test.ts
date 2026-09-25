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
