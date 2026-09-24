import { describe, expect, test } from 'vitest'
import { updateCourtSchema } from './court'

const base = {
  nombre: 'Cancha 1',
  precioBase: 25000,
  horaApertura: '08:00',
  horaCierre: '23:00',
  duracionTurnoMin: 60,
  porcentajeSena: null,
}

describe('updateCourtSchema — combinación deporte/superficie', () => {
  test('acepta fútbol con césped sintético', () => {
    const parsed = updateCourtSchema.safeParse({
      ...base,
      deporte: 'FUTBOL_11',
      tipoSuperficie: 'CESPED_SINTETICO',
    })
    expect(parsed.success).toBe(true)
  })

  test('rechaza fútbol con polvo de ladrillo', () => {
    const parsed = updateCourtSchema.safeParse({
      ...base,
      deporte: 'FUTBOL_11',
      tipoSuperficie: 'POLVO_DE_LADRILLO',
    })
    expect(parsed.success).toBe(false)
  })

  test('acepta tenis con polvo de ladrillo', () => {
    const parsed = updateCourtSchema.safeParse({
      ...base,
      deporte: 'TENIS',
      tipoSuperficie: 'POLVO_DE_LADRILLO',
    })
    expect(parsed.success).toBe(true)
  })

  test('rechaza pádel con césped natural', () => {
    const parsed = updateCourtSchema.safeParse({
      ...base,
      deporte: 'PADEL',
      tipoSuperficie: 'CESPED_NATURAL',
    })
    expect(parsed.success).toBe(false)
  })
})
