import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { db } from '@/lib/db'
import { getComplexDetail, getSearchableZones, searchComplexes } from '@/lib/court-search'
import {
  datosDeComplejo,
  crearComplejoConCanchas,
  crearUsuario,
  diaDeAyer,
  diaDeManiana,
  limpiarDatosDeTest,
} from './helpers'

// El complejo de test tiene 2 canchas:
//   Cancha 1: Fútbol 5, césped sintético, $10.000
//   Cancha 2: Fútbol 7, cemento, $15.000
let complejoId: string

beforeAll(async () => {
  await limpiarDatosDeTest()
  const duenio = await crearUsuario('DUENIO')
  const { complejo } = await crearComplejoConCanchas(duenio.id)
  complejoId = complejo.id
})

afterAll(async () => {
  await limpiarDatosDeTest()
})

// Se filtra por la zona de test para no mezclarse con complejos reales de la DB
async function buscar(filtros: Parameters<typeof searchComplexes>[0]) {
  const complejos = await searchComplexes({ zona: datosDeComplejo.zona, ...filtros })
  return complejos.find((complejo) => complejo.id === complejoId)
}

describe('searchComplexes', () => {
  test('sin filtros devuelve el complejo con todas sus canchas', async () => {
    const complejo = await buscar({})
    expect(complejo?.canchas.length).toBe(2)
  })

  test('por deporte deja solo las canchas de ese deporte', async () => {
    const complejo = await buscar({ deporte: 'FUTBOL_7' })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 2')
  })

  test('por superficie deja solo las canchas de esa superficie', async () => {
    const complejo = await buscar({ tipoSuperficie: 'CESPED_SINTETICO' })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 1')
  })

  test('por precio máximo deja solo las canchas que no lo superan', async () => {
    const complejo = await buscar({ precioMax: 12000 })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 1')
  })

  test('por precio mínimo deja solo las canchas que lo alcanzan', async () => {
    const complejo = await buscar({ precioMin: 12000 })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 2')
  })

  test('el precio mínimo y el máximo se incluyen a sí mismos', async () => {
    const complejo = await buscar({ precioMin: 10000, precioMax: 15000 })
    expect(complejo?.canchas.length).toBe(2)
  })

  test('varios filtros se combinan: deben cumplirse todos en la misma cancha', async () => {
    // Fútbol 7 existe y cuesta menos de 12000 existe, pero no es la misma cancha
    const complejo = await buscar({ deporte: 'FUTBOL_7', precioMax: 12000 })
    expect(complejo).toBeUndefined()
  })

  test('si ninguna cancha cumple, el complejo no aparece', async () => {
    expect(await buscar({ precioMin: 20000 })).toBeUndefined()
    expect(await buscar({ deporte: 'TENIS' })).toBeUndefined()
  })

  test('por zona solo trae los complejos de esa zona', async () => {
    const complejos = await searchComplexes({ zona: 'Zona que no existe' })
    expect(complejos.length).toBe(0)
  })
})

describe('getComplexDetail', () => {
  test('sin filtros muestra todas las canchas del complejo', async () => {
    const complejo = await getComplexDetail(complejoId, {})
    expect(complejo?.canchas.length).toBe(2)
  })

  test('si se buscó por deporte, solo muestra las canchas de ese deporte', async () => {
    const complejo = await getComplexDetail(complejoId, { deporte: 'FUTBOL_7' })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 2')
  })

  test('los demás filtros también se respetan (superficie y precio)', async () => {
    const porSuperficie = await getComplexDetail(complejoId, { tipoSuperficie: 'CESPED_SINTETICO' })
    expect(porSuperficie?.canchas.length).toBe(1)
    expect(porSuperficie?.canchas[0].nombre).toBe('Cancha 1')

    const porPrecio = await getComplexDetail(complejoId, { precioMin: 12000 })
    expect(porPrecio?.canchas.length).toBe(1)
    expect(porPrecio?.canchas[0].nombre).toBe('Cancha 2')
  })

  test('el complejo sigue existiendo aunque ninguna cancha cumpla los filtros', async () => {
    const complejo = await getComplexDetail(complejoId, { deporte: 'TENIS' })
    expect(complejo?.id).toBe(complejoId)
    expect(complejo?.canchas.length).toBe(0)
  })

  test('un complejo que no existe devuelve null', async () => {
    expect(await getComplexDetail('no-existe', {})).toBeNull()
  })
})

describe('zona', () => {
  test('la zona se busca sin importar mayúsculas y minúsculas', async () => {
    const complejo = await buscar({ zona: datosDeComplejo.zona.toUpperCase() })
    expect(complejo?.id).toBe(complejoId)
  })

  test('las zonas para elegir son solo las que tienen alguna cancha activa', async () => {
    const duenio = await crearUsuario('DUENIO')
    const { complejo, cancha1, cancha2 } = await crearComplejoConCanchas(duenio.id)
    await db.complejo.update({ where: { id: complejo.id }, data: { zona: 'Zona sin canchas' } })

    expect(await getSearchableZones()).toContain('Zona sin canchas')

    await db.cancha.updateMany({
      where: { id: { in: [cancha1.id, cancha2.id] } },
      data: { activo: false },
    })

    const zonas = await getSearchableZones()
    expect(zonas).not.toContain('Zona sin canchas')
    expect(zonas).toContain(datosDeComplejo.zona)
  })

  test('las zonas no se repiten', async () => {
    const zonas = await getSearchableZones()
    expect(zonas.length).toBe(new Set(zonas).size)
  })
})

// Mañana, en la Cancha 1 (Fútbol 5, $10.000, turnos de 08 a 12):
//   09:00 reservado · 10:00 bloqueado · 11:00 con precio especial de $5.000
// Quedan libres el turno de las 08 ($10.000) y el de las 11 ($5.000).
// La Cancha 2 (Fútbol 7, $15.000) está libre todo el día.
describe('fecha y horario', () => {
  beforeAll(async () => {
    const jugador = await crearUsuario('JUGADOR')
    const cancha1 = await db.cancha.findFirstOrThrow({
      where: { complejoId, nombre: 'Cancha 1' },
    })

    await db.reserva.create({
      data: {
        canchaId: cancha1.id,
        jugadorId: jugador.id,
        fecha: new Date(diaDeManiana()),
        horaInicio: '09:00',
        horaFin: '10:00',
        estado: 'CONFIRMADA',
        precioTurno: 10000,
      },
    })
    await db.block.create({
      data: {
        courtId: cancha1.id,
        startDate: new Date(diaDeManiana()),
        endDate: new Date(diaDeManiana()),
        startTime: '10:00',
        endTime: '11:00',
      },
    })
    await db.precioEspecial.create({
      data: { canchaId: cancha1.id, horaInicio: '11:00', horaFin: '12:00', precio: 5000 },
    })
  })

  function nombresDeCanchas(complejo: Awaited<ReturnType<typeof buscar>>) {
    return complejo?.canchas.map((cancha) => cancha.nombre)
  }

  test('solo con fecha aparecen las canchas que tienen algún turno libre ese día', async () => {
    const complejo = await buscar({ fecha: diaDeManiana() })
    expect(nombresDeCanchas(complejo)).toEqual(['Cancha 1', 'Cancha 2'])
  })

  test('un turno reservado o bloqueado no cuenta: la cancha sin turnos libres en la ventana sale', async () => {
    // 09 está reservado y 10 bloqueado: la Cancha 1 no tiene nada libre entre 09 y 11
    const complejo = await buscar({
      fecha: diaDeManiana(),
      horaDesde: '09:00',
      horaHasta: '11:00',
    })
    expect(nombresDeCanchas(complejo)).toEqual(['Cancha 2'])
  })

  test('una ventana con turnos libres en las dos canchas trae las dos', async () => {
    const complejo = await buscar({
      fecha: diaDeManiana(),
      horaDesde: '08:00',
      horaHasta: '09:00',
    })
    expect(nombresDeCanchas(complejo)).toEqual(['Cancha 1', 'Cancha 2'])
  })

  test('se combina con los otros filtros: deporte sin turnos en la ventana', async () => {
    const complejo = await buscar({
      fecha: diaDeManiana(),
      horaDesde: '09:00',
      horaHasta: '11:00',
      deporte: 'FUTBOL_5',
    })
    expect(complejo).toBeUndefined()
  })

  test('con fecha, el precio es el del turno: el precio especial deja pasar a la Cancha 1', async () => {
    const complejo = await buscar({ fecha: diaDeManiana(), precioMax: 6000 })
    expect(nombresDeCanchas(complejo)).toEqual(['Cancha 1'])
  })

  test('el precio se mira sobre el mismo turno que cumple la ventana', async () => {
    // El turno barato es el de las 11, que queda fuera de la ventana 08 a 10
    const complejo = await buscar({
      fecha: diaDeManiana(),
      horaDesde: '08:00',
      horaHasta: '10:00',
      precioMax: 6000,
    })
    expect(complejo).toBeUndefined()
  })

  test('sin fecha el precio sigue siendo el precio base de la cancha', async () => {
    const complejo = await buscar({ precioMax: 6000 })
    expect(complejo).toBeUndefined()
  })

  test('el "desde" de cada cancha es su turno más barato que cumple los filtros', async () => {
    const conFecha = await buscar({ fecha: diaDeManiana() })
    expect(conFecha?.canchas.map((cancha) => cancha.priceFrom)).toEqual([5000, 15000])

    const sinFecha = await buscar({})
    expect(sinFecha?.canchas.map((cancha) => cancha.priceFrom)).toEqual([10000, 15000])
  })

  test('un día que ya pasó no tiene turnos libres', async () => {
    expect(await buscar({ fecha: diaDeAyer() })).toBeUndefined()
  })

  test('el detalle del complejo muestra solo las canchas con turno libre en la ventana', async () => {
    const complejo = await getComplexDetail(complejoId, {
      fecha: diaDeManiana(),
      horaDesde: '09:00',
      horaHasta: '11:00',
    })
    expect(complejo?.canchas.map((cancha) => cancha.nombre)).toEqual(['Cancha 2'])
  })
})
