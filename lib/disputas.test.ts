import { describe, expect, test } from 'vitest'
import { sePuedeDisputar, vencioElPlazoParaDisputar } from './disputas'

describe('vencioElPlazoParaDisputar', () => {
  test('el plazo llega hasta 7 días después de la marca', () => {
    expect(vencioElPlazoParaDisputar('2026-10-01', '2026-10-08')).toBe(false)
    expect(vencioElPlazoParaDisputar('2026-10-01', '2026-10-09')).toBe(true)
  })
})

// El turno fue el 2026-10-01 de 20:00 a 21:00 y el dueño lo marcó ese mismo
// día a la noche, salvo que el test diga otra cosa.
const marcadoElPrimero = new Date('2026-10-01T23:00:00Z')

function puedeDisputar(
  asistio: boolean | null,
  hoy: string,
  asistenciaMarcadaEn: Date | null = marcadoElPrimero,
) {
  return sePuedeDisputar(
    {
      estado: 'CONFIRMADA',
      asistio,
      dia: '2026-10-01',
      horaInicio: '20:00',
      horaFin: '21:00',
      asistenciaMarcadaEn,
    },
    { dia: hoy, hora: '12:00' },
  )
}

describe('sePuedeDisputar', () => {
  test('un no-show se disputa hasta 7 días después de la marca', () => {
    expect(puedeDisputar(false, '2026-10-02')).toBe(true)
    expect(puedeDisputar(false, '2026-10-08')).toBe(true)
    expect(puedeDisputar(false, '2026-10-09')).toBe(false)
  })

  test('si el dueño vuelve a marcar el no-show, el plazo arranca de nuevo', () => {
    const marcadoDeNuevo = new Date('2026-10-20T15:00:00Z')
    expect(puedeDisputar(false, '2026-10-21', marcadoDeNuevo)).toBe(true)
  })

  test('sin marca de asistencia no hay nada que disputar', () => {
    expect(puedeDisputar(null, '2026-10-02', null)).toBe(false)
  })

  test('un turno al que el jugador fue no se disputa', () => {
    expect(puedeDisputar(true, '2026-10-02')).toBe(false)
  })

  test('un turno que todavía no terminó no se disputa', () => {
    expect(puedeDisputar(false, '2026-10-01')).toBe(false)
  })
})
