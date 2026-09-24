import { describe, expect, it } from 'vitest'
import { Prisma } from '@/lib/generated/prisma/client'
import { generateSlots, precioDelTurno } from './availability'

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

describe('precioDelTurno', () => {
  const precioBase = new Prisma.Decimal(1000)
  const MARTES = 2

  it('sin PrecioEspecial, usa precioBase', () => {
    const precio = precioDelTurno(precioBase, [], MARTES, '18:00')
    expect(precio.equals(precioBase)).toBe(true)
  })

  it('con un PrecioEspecial de franja horaria que matchea, gana sobre uno de solo día', () => {
    const deSoloDia = {
      diaSemana: MARTES,
      horaInicio: null,
      horaFin: null,
      precio: new Prisma.Decimal(1200),
    }
    const deFranja = {
      diaSemana: null,
      horaInicio: '18:00',
      horaFin: '22:00',
      precio: new Prisma.Decimal(1500),
    }
    const precio = precioDelTurno(precioBase, [deSoloDia, deFranja], MARTES, '18:00')
    expect(precio.equals(deFranja.precio)).toBe(true)
  })

  it('con un PrecioEspecial que no matchea el día ni la franja, usa precioBase', () => {
    const otroDia = {
      diaSemana: MARTES + 1,
      horaInicio: null,
      horaFin: null,
      precio: new Prisma.Decimal(1200),
    }
    const otraFranja = {
      diaSemana: null,
      horaInicio: '22:00',
      horaFin: '23:00',
      precio: new Prisma.Decimal(1500),
    }
    const precio = precioDelTurno(precioBase, [otroDia, otraFranja], MARTES, '18:00')
    expect(precio.equals(precioBase)).toBe(true)
  })
})
