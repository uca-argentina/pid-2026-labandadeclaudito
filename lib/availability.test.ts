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

  it('cuando cierra después de medianoche, genera los turnos de la madrugada y los de la noche', () => {
    const slots = generateSlots('20:00', '03:00', 60)
    expect(slots).toEqual(['00:00', '01:00', '02:00', '20:00', '21:00', '22:00', '23:00'])
  })

  it('cuando abre y cierra a la misma hora, lo trata como abierto las 24hs', () => {
    const slots = generateSlots('08:00', '08:00', 60 * 4)
    expect(slots).toEqual(['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'])
  })
})
