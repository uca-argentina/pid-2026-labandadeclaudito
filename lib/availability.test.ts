import { describe, expect, it } from 'vitest'
import { Prisma } from '@/lib/generated/prisma/client'
import { precioDelTurno } from './availability'

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
