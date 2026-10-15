import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { db } from '@/lib/db'
import { dondeHistorial, dondeProximas } from '@/lib/bookings'
import { crearComplejoConCanchas, crearUsuario, diaEnNDias, limpiarDatosDeTest } from './helpers'

// Un "ahora" fijo dentro de 30 días a las 15:00: así el test no depende de la
// hora a la que se corra.
const hoy = diaEnNDias(30)
const ayer = diaEnNDias(29)
const maniana = diaEnNDias(31)
const ahora = { dia: hoy, hora: '15:00' }

type Seccion = 'proximas' | 'historial' | 'canceladas'

// Cada caso dice en qué sección tiene que aparecer, según la misma regla que
// usa estadoDeReserva(). seccion: null = no aparece en ninguna.
const casos: {
  nombre: string
  fecha: string
  horaInicio: string
  horaFin: string
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA'
  asistio?: boolean
  senaVencida?: boolean
  seccion: Seccion | null
}[] = [
  {
    nombre: 'confirmada de mañana',
    fecha: maniana,
    horaInicio: '10:00',
    horaFin: '11:00',
    estado: 'CONFIRMADA',
    seccion: 'proximas',
  },
  {
    nombre: 'confirmada de hoy que todavía no empezó',
    fecha: hoy,
    horaInicio: '16:00',
    horaFin: '17:00',
    estado: 'CONFIRMADA',
    seccion: 'proximas',
  },
  {
    nombre: 'confirmada de hoy en curso',
    fecha: hoy,
    horaInicio: '14:30',
    horaFin: '15:30',
    estado: 'CONFIRMADA',
    seccion: 'proximas',
  },
  {
    nombre: 'confirmada de hoy que termina justo ahora',
    fecha: hoy,
    horaInicio: '14:00',
    horaFin: '15:00',
    estado: 'CONFIRMADA',
    seccion: 'historial',
  },
  {
    nombre: 'confirmada de hoy que ya terminó',
    fecha: hoy,
    horaInicio: '12:00',
    horaFin: '13:00',
    estado: 'CONFIRMADA',
    seccion: 'historial',
  },
  {
    nombre: 'confirmada de hoy que termina a medianoche',
    fecha: hoy,
    horaInicio: '23:00',
    horaFin: '00:00',
    estado: 'CONFIRMADA',
    seccion: 'proximas',
  },
  {
    nombre: 'confirmada de ayer',
    fecha: ayer,
    horaInicio: '10:00',
    horaFin: '11:00',
    estado: 'CONFIRMADA',
    seccion: 'historial',
  },
  {
    nombre: 'confirmada de ayer con asistencia marcada',
    fecha: ayer,
    horaInicio: '11:00',
    horaFin: '12:00',
    estado: 'CONFIRMADA',
    asistio: true,
    seccion: 'historial',
  },
  {
    nombre: 'pendiente de hoy que empieza justo ahora',
    fecha: hoy,
    horaInicio: '15:00',
    horaFin: '16:00',
    estado: 'PENDIENTE',
    seccion: 'proximas',
  },
  {
    nombre: 'pendiente de hoy que ya empezó',
    fecha: hoy,
    horaInicio: '13:00',
    horaFin: '14:00',
    estado: 'PENDIENTE',
    seccion: 'historial',
  },
  {
    nombre: 'pendiente de mañana con la seña vencida',
    fecha: maniana,
    horaInicio: '11:00',
    horaFin: '12:00',
    estado: 'PENDIENTE',
    senaVencida: true,
    seccion: null,
  },
  {
    nombre: 'cancelada de mañana',
    fecha: maniana,
    horaInicio: '12:00',
    horaFin: '13:00',
    estado: 'CANCELADA',
    seccion: 'canceladas',
  },
  {
    nombre: 'cancelada de ayer',
    fecha: ayer,
    horaInicio: '12:00',
    horaFin: '13:00',
    estado: 'CANCELADA',
    seccion: 'canceladas',
  },
]

// id de la reserva creada para cada caso, por nombre
const idPorCaso = new Map<string, string>()

beforeAll(async () => {
  await limpiarDatosDeTest()
  const duenio = await crearUsuario('DUENIO')
  const jugador = await crearUsuario('JUGADOR')
  const { cancha1 } = await crearComplejoConCanchas(duenio.id)

  for (const caso of casos) {
    // Una seña vencida = la reserva se pidió hace más de 15 minutos
    const creadaHaceUnaHora = new Date(Date.now() - 60 * 60 * 1000)
    const reserva = await db.reserva.create({
      data: {
        canchaId: cancha1.id,
        jugadorId: jugador.id,
        fecha: new Date(caso.fecha),
        horaInicio: caso.horaInicio,
        horaFin: caso.horaFin,
        estado: caso.estado,
        asistio: caso.asistio ?? null,
        precioTurno: 10000,
        createdAt: caso.senaVencida ? creadaHaceUnaHora : undefined,
      },
    })
    idPorCaso.set(caso.nombre, reserva.id)
  }
})

afterAll(async () => {
  await limpiarDatosDeTest()
})

// En qué secciones aparece una reserva, preguntándole a la base
async function seccionesDe(id: string) {
  const secciones: Seccion[] = []
  if (await db.reserva.count({ where: { id, ...dondeProximas(ahora) } })) {
    secciones.push('proximas')
  }
  if (await db.reserva.count({ where: { id, ...dondeHistorial(ahora) } })) {
    secciones.push('historial')
  }
  if (await db.reserva.count({ where: { id, estado: 'CANCELADA' } })) {
    secciones.push('canceladas')
  }
  return secciones
}

describe('dondeProximas y dondeHistorial', () => {
  for (const caso of casos) {
    test(caso.nombre, async () => {
      const secciones = await seccionesDe(idPorCaso.get(caso.nombre)!)
      // Exactamente una sección (o ninguna, si la seña venció)
      expect(secciones).toEqual(caso.seccion ? [caso.seccion] : [])
    })
  }
})
