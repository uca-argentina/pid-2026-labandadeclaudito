import { describe, expect, test } from 'vitest'
import { createPriceSchema } from './price'

describe('createPriceSchema', () => {
  test('acepta un precio para todos los días, todo el día', () => {
    const parsed = createPriceSchema.safeParse({
      diaSemana: null,
      horaInicio: null,
      horaFin: null,
      precio: 30000,
    })
    expect(parsed.success).toBe(true)
  })

  test('acepta un precio con día y franja horaria', () => {
    const parsed = createPriceSchema.safeParse({
      diaSemana: 6,
      horaInicio: '20:00',
      horaFin: '23:00',
      precio: 35000,
    })
    expect(parsed.success).toBe(true)
  })

  test('rechaza cuando solo se manda una de las dos horas', () => {
    const parsed = createPriceSchema.safeParse({
      diaSemana: null,
      horaInicio: '20:00',
      horaFin: null,
      precio: 30000,
    })
    expect(parsed.success).toBe(false)
  })

  test('rechaza cuando horaInicio no es anterior a horaFin', () => {
    const parsed = createPriceSchema.safeParse({
      diaSemana: null,
      horaInicio: '21:00',
      horaFin: '20:00',
      precio: 30000,
    })
    expect(parsed.success).toBe(false)
  })

  test('rechaza un precio negativo o cero', () => {
    const parsed = createPriceSchema.safeParse({
      diaSemana: null,
      horaInicio: null,
      horaFin: null,
      precio: 0,
    })
    expect(parsed.success).toBe(false)
  })
})
