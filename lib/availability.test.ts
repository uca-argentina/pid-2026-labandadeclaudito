import { describe, expect, it } from 'vitest'
import { generateSlots } from './availability'

describe('generateSlots', () => {
  it('genera turnos de 60 minutos entre apertura y cierre', () => {
    const slots = generateSlots('08:00', '10:00', 60)
    expect(slots).toEqual(['08:00', '09:00'])
  })

  it('no incluye el turno que empezaría después del cierre', () => {
    const slots = generateSlots('08:00', '09:30', 60)
    expect(slots).toEqual(['08:00'])
  })
})
