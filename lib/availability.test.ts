import { describe, expect, it } from 'vitest'
import { Prisma } from '@/lib/generated/prisma/client'
import { precioDelTurno, precioProporcional } from './availability'

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

describe('precioProporcional', () => {
  const precioCompleto = new Prisma.Decimal(9000)

  it('un turno completo cobra el precio entero', () => {
    const precio = precioProporcional(precioCompleto, '14:00', '15:30', 90)
    expect(precio.equals(precioCompleto)).toBe(true)
  })

  it('un turno de 30 min en una cancha de turnos de 90 cobra 1/3', () => {
    const precio = precioProporcional(precioCompleto, '15:30', '16:00', 90)
    expect(precio.equals(new Prisma.Decimal(3000))).toBe(true)
  })

  it('un turno corto que termina a medianoche también cobra la parte proporcional', () => {
    const precio = precioProporcional(precioCompleto, '23:30', '00:00', 90)
    expect(precio.equals(new Prisma.Decimal(3000))).toBe(true)
  })
})
