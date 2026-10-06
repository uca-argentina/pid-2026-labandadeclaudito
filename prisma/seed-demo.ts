// Datos para mostrarle la app a un cliente (base de prod, tocayjuga.com).
// Correr con (DATABASE_URL tiene que ser la de prod: `vercel env run` NO sirve
// desde el repo, porque el DATABASE_URL del .env local le gana):
//   DEMO_PASSWORD=<clave> DATABASE_URL=<url de prod> npm run db:seed-demo
//
// A diferencia de prisma/seed.ts (casos de QA para probar a mano), acá no hay
// complejos dados de baja ni reservas raras: solo datos que se ven bien, con
// la agenda bastante llena para que el calendario y el historial se vean vivos.
//
// OJO: borra TODA la base antes de cargar. Es para la base de la demo, NO
// para la base compartida de dev.
//
// La contraseña de todas las cuentas sale de DEMO_PASSWORD: el repo es
// público, si estuviera escrita acá cualquiera podría entrar a la demo.
import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/passwords'
import { precioDelTurno, precioProporcional } from '@/lib/availability'
import { diaDeHoy, diaSemanaDeReserva, generateSlots } from '@/lib/time'
import { Prisma } from '@/lib/generated/prisma/client'
import type { Deporte, TipoSuperficie } from '@/lib/generated/prisma/client'

// Reservas desde hace 3 semanas hasta dentro de 10 días
const DIAS_DE_HISTORIAL = 21
const DIAS_DE_AGENDA = 10

// ---------- Helpers ----------

// Día YYYY-MM-DD a N días de hoy (negativo = pasado)
function dia(diasDesdeHoy: number): string {
  const fecha = new Date(`${diaDeHoy()}T00:00:00Z`)
  fecha.setUTCDate(fecha.getUTCDate() + diasDesdeHoy)
  return fecha.toISOString().slice(0, 10)
}

function foto(id: string): string {
  return `https://images.unsplash.com/${id}?w=1200&q=80`
}

async function borrarTodo() {
  await db.pago.deleteMany()
  await db.reserva.deleteMany()
  await db.block.deleteMany()
  await db.precioEspecial.deleteMany()
  await db.imagenComplejo.deleteMany()
  await db.cancha.deleteMany()
  await db.complejo.deleteMany()
  await db.usuario.deleteMany()
}

// Después de las 18 casi todo se llena, al mediodía algo y a la mañana poco
function probabilidadDeOcupacion(horaInicio: string): number {
  const hora = Number(horaInicio.slice(0, 2))
  if (hora >= 18) return 0.7
  if (hora >= 12) return 0.25
  return 0.1
}

// ---------- Datos ----------

type CanchaDemo = {
  nombre: string
  deporte: Deporte
  tipoSuperficie: TipoSuperficie
  capacidad: number
  precioBase: number
  // Precio de 19 a 23 todos los días (si no hay, se cobra precioBase)
  precioNocturno?: number
  horaApertura: string
  horaCierre: string
  duracionTurnoMin: number
}

type ComplejoDemo = {
  nombre: string
  direccion: string
  zona: string
  contacto: string
  duenioEmail: string
  porcentajeSena: number
  cancellationHours: number
  fotos: string[]
  canchas: CanchaDemo[]
}

const DUENIOS = [
  { nombre: 'Martín Gómez', email: 'dueno@tocayjuga.com', telefono: '11 4775-1234' },
  { nombre: 'Laura Fernández', email: 'laura.fernandez@tocayjuga.com', telefono: '11 4783-5566' },
  { nombre: 'Diego Sosa', email: 'diego.sosa@tocayjuga.com', telefono: '11 4799-3030' },
  { nombre: 'Sofía Paz', email: 'sofia.paz@tocayjuga.com', telefono: '11 4792-8080' },
]

// El primero es el jugador de la demo; el resto llena la agenda
const JUGADORES = [
  { nombre: 'Juan Pérez', email: 'jugador@tocayjuga.com' },
  { nombre: 'Lucas Martínez', email: 'lucas.martinez@tocayjuga.com' },
  { nombre: 'Tomás Álvarez', email: 'tomas.alvarez@tocayjuga.com' },
  { nombre: 'Agustina Romero', email: 'agustina.romero@tocayjuga.com' },
  { nombre: 'Nicolás Benítez', email: 'nicolas.benitez@tocayjuga.com' },
  { nombre: 'Valentina Torres', email: 'valentina.torres@tocayjuga.com' },
  { nombre: 'Federico Díaz', email: 'federico.diaz@tocayjuga.com' },
  { nombre: 'Martina Acosta', email: 'martina.acosta@tocayjuga.com' },
  { nombre: 'Santiago Herrera', email: 'santiago.herrera@tocayjuga.com' },
  { nombre: 'Julieta Medina', email: 'julieta.medina@tocayjuga.com' },
  { nombre: 'Matías Castro', email: 'matias.castro@tocayjuga.com' },
  { nombre: 'Florencia Ríos', email: 'florencia.rios@tocayjuga.com' },
  { nombre: 'Ignacio Molina', email: 'ignacio.molina@tocayjuga.com' },
]

const FUTBOL_5: Omit<CanchaDemo, 'nombre'> = {
  deporte: 'FUTBOL_5',
  tipoSuperficie: 'CESPED_SINTETICO',
  capacidad: 10,
  precioBase: 45000,
  precioNocturno: 55000,
  horaApertura: '09:00',
  horaCierre: '00:00',
  duracionTurnoMin: 60,
}

const FUTBOL_7: Omit<CanchaDemo, 'nombre'> = {
  deporte: 'FUTBOL_7',
  tipoSuperficie: 'CESPED_SINTETICO',
  capacidad: 14,
  precioBase: 65000,
  precioNocturno: 80000,
  horaApertura: '09:00',
  horaCierre: '00:00',
  duracionTurnoMin: 60,
}

const PADEL: Omit<CanchaDemo, 'nombre'> = {
  deporte: 'PADEL',
  tipoSuperficie: 'CESPED_SINTETICO',
  capacidad: 4,
  precioBase: 32000,
  precioNocturno: 38000,
  horaApertura: '08:00',
  horaCierre: '00:00',
  duracionTurnoMin: 90,
}

const TENIS: Omit<CanchaDemo, 'nombre'> = {
  deporte: 'TENIS',
  tipoSuperficie: 'POLVO_DE_LADRILLO',
  capacidad: 4,
  precioBase: 24000,
  horaApertura: '08:00',
  horaCierre: '22:00',
  duracionTurnoMin: 60,
}

const COMPLEJOS: ComplejoDemo[] = [
  {
    nombre: 'Distrito Fútbol Palermo',
    direccion: 'Av. Santa Fe 4321',
    zona: 'Palermo',
    contacto: '11 4775-1234',
    duenioEmail: 'dueno@tocayjuga.com',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [
      foto('photo-1431324155629-1a6deb1dec8d'),
      foto('photo-1624880357913-a8539238245b'),
      foto('photo-1551958219-acbc608c6377'),
    ],
    canchas: [
      { nombre: 'Cancha 1', ...FUTBOL_5 },
      { nombre: 'Cancha 2', ...FUTBOL_5 },
      { nombre: 'Cancha 3', ...FUTBOL_7 },
    ],
  },
  {
    nombre: 'La Redonda Núñez',
    direccion: 'Av. del Libertador 7800',
    zona: 'Núñez',
    contacto: '11 4701-2233',
    duenioEmail: 'dueno@tocayjuga.com',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [
      foto('photo-1579952363873-27f3bade9f55'),
      foto('photo-1553778263-73a83bab9b0c'),
      foto('photo-1459865264687-595d652de67e'),
    ],
    canchas: [
      { nombre: 'Cancha 1', ...FUTBOL_5 },
      { nombre: 'Cancha 2', ...FUTBOL_5 },
      { nombre: 'Cancha Grande', ...FUTBOL_7 },
    ],
  },
  {
    nombre: 'Almagro Fútbol 5',
    direccion: 'Av. Corrientes 4100',
    zona: 'Almagro',
    contacto: '11 4862-4455',
    duenioEmail: 'dueno@tocayjuga.com',
    porcentajeSena: 25,
    cancellationHours: 12,
    fotos: [
      foto('photo-1574629810360-7efbbe195018'),
      foto('photo-1606925797300-0b35e9d1794e'),
      foto('photo-1600679472829-3044539ce8ed'),
    ],
    canchas: [
      { nombre: 'Techada', ...FUTBOL_5, precioBase: 48000, precioNocturno: 58000 },
      { nombre: 'Descubierta', ...FUTBOL_5 },
    ],
  },
  {
    nombre: 'Belgrano Racket Club',
    direccion: 'Av. Cabildo 2350',
    zona: 'Belgrano',
    contacto: '11 4783-5566',
    duenioEmail: 'laura.fernandez@tocayjuga.com',
    porcentajeSena: 50,
    cancellationHours: 24,
    fotos: [
      foto('photo-1612534847738-b3af9bc31f0c'),
      foto('photo-1595435934249-5df7ed86e1c0'),
      foto('photo-1530915365347-e35b749a0381'),
    ],
    canchas: [
      { nombre: 'Pádel 1', ...PADEL },
      { nombre: 'Pádel 2', ...PADEL },
      { nombre: 'Tenis Central', ...TENIS },
    ],
  },
  {
    nombre: 'Club Social Villa Urquiza',
    direccion: 'Av. Triunvirato 4950',
    zona: 'Villa Urquiza',
    contacto: '11 4521-9090',
    duenioEmail: 'laura.fernandez@tocayjuga.com',
    porcentajeSena: 40,
    cancellationHours: 48,
    fotos: [
      foto('photo-1554068865-24cecd4e34b8'),
      foto('photo-1543326727-cf6c39e8f84c'),
      foto('photo-1622279457486-62dcc4a431d6'),
    ],
    canchas: [
      {
        nombre: 'Cancha Principal',
        deporte: 'FUTBOL_11',
        tipoSuperficie: 'CESPED_NATURAL',
        capacidad: 22,
        precioBase: 120000,
        horaApertura: '10:00',
        horaCierre: '22:00',
        duracionTurnoMin: 90,
      },
      { nombre: 'Tenis 1', ...TENIS },
      { nombre: 'Tenis 2', ...TENIS },
    ],
  },
  {
    nombre: 'Polideportivo Parque Centenario',
    direccion: 'Av. Díaz Vélez 4800',
    zona: 'Caballito',
    contacto: '11 4983-7711',
    duenioEmail: 'diego.sosa@tocayjuga.com',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [
      foto('photo-1546519638-68e109498ffc'),
      foto('photo-1627627256672-027a4613d028'),
      foto('photo-1519861531473-9200262188bf'),
    ],
    canchas: [
      {
        nombre: 'Básquet',
        deporte: 'BASQUET',
        tipoSuperficie: 'PARQUET',
        capacidad: 10,
        precioBase: 40000,
        horaApertura: '09:00',
        horaCierre: '23:00',
        duracionTurnoMin: 60,
      },
      { nombre: 'Fútbol 5 Techado', ...FUTBOL_5 },
    ],
  },
  {
    nombre: 'Fútbol Norte Olivos',
    direccion: 'Av. Maipú 2800',
    zona: 'Olivos',
    contacto: '11 4799-3030',
    duenioEmail: 'diego.sosa@tocayjuga.com',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [
      foto('photo-1560272564-c83b66b1ad12'),
      foto('photo-1511886929837-354d827aae26'),
      foto('photo-1575361204480-aadea25e6e68'),
    ],
    canchas: [
      { nombre: 'Cancha A', ...FUTBOL_7 },
      { nombre: 'Cancha B', ...FUTBOL_5 },
    ],
  },
  {
    nombre: 'Costa Fútbol Martínez',
    direccion: 'Av. Santa Fe 1900',
    zona: 'Martínez',
    contacto: '11 4792-8080',
    duenioEmail: 'sofia.paz@tocayjuga.com',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [
      foto('photo-1517466787929-bc90951d0974'),
      foto('photo-1518604666860-9ed391f76460'),
      foto('photo-1529900748604-07564a03e7a6'),
    ],
    canchas: [
      { nombre: 'Cancha 1', ...FUTBOL_5 },
      { nombre: 'Cancha 2', ...FUTBOL_5 },
      { nombre: 'Cancha 3', ...FUTBOL_7 },
    ],
  },
]

// ---------- Reservas ----------

// Lo que hace falta de una cancha ya creada para armar sus reservas
type CanchaCreada = {
  id: string
  complejo: string
  nombre: string
  precioBase: Prisma.Decimal
  precioNocturno?: number
  horaApertura: string
  horaCierre: string
  duracionTurnoMin: number
  porcentajeSena: number
  cancellationHours: number
}

// Las reservas se juntan acá y se insertan todas juntas al final (de a una
// serían miles de idas y vueltas a la base)
const reservas: Prisma.ReservaCreateManyInput[] = []
const pagos: Prisma.PagoCreateManyInput[] = []
// "canchaId fecha hora": para no reservar dos veces el mismo turno
const turnosOcupados = new Set<string>()
// "jugadorId fecha hora": para que un jugador no esté en dos canchas a la vez.
// ponytail: compara solo la hora de inicio, no detecta un turno de 90 min que
// pisa a uno de 60 que empieza media hora después (no se ve en la demo).
const jugadoresOcupados = new Set<string>()

// Mismo cálculo de precio y seña que POST /api/bookings y su /deposit
function agregarReserva(
  cancha: CanchaCreada,
  jugadorId: string,
  diasDesdeHoy: number,
  horaInicio: string,
  cancelada = false,
) {
  const fecha = dia(diasDesdeHoy)
  const turnos = generateSlots(cancha.horaApertura, cancha.horaCierre, cancha.duracionTurnoMin)
  const turno = turnos.find((t) => t.horaInicio === horaInicio)
  if (!turno) {
    throw new Error(`${horaInicio} no es un turno de ${cancha.complejo} / ${cancha.nombre}`)
  }

  const preciosEspeciales = []
  if (cancha.precioNocturno) {
    preciosEspeciales.push({
      diaSemana: null,
      horaInicio: '19:00',
      horaFin: '23:00',
      precio: new Prisma.Decimal(cancha.precioNocturno),
    })
  }
  const precioTurno = precioProporcional(
    precioDelTurno(
      cancha.precioBase,
      preciosEspeciales,
      diaSemanaDeReserva(new Date(fecha)),
      turno.horaInicio,
    ),
    turno.horaInicio,
    turno.horaFin,
    cancha.duracionTurnoMin,
  )

  // Ya jugada: casi todos fueron. Futura (o de hoy): todavía sin marcar
  let asistio: boolean | null = null
  if (diasDesdeHoy < 0 && !cancelada) {
    asistio = Math.random() < 0.93
  }

  // Pedida unos días antes del turno (nunca en el futuro)
  const diasAntes = Math.max(-diasDesdeHoy, 0) + 2
  const reservaId = randomUUID()
  reservas.push({
    id: reservaId,
    canchaId: cancha.id,
    jugadorId,
    fecha: new Date(fecha),
    horaInicio: turno.horaInicio,
    horaFin: turno.horaFin,
    estado: cancelada ? 'CANCELADA' : 'CONFIRMADA',
    asistio,
    precioTurno,
    createdAt: new Date(Date.now() - diasAntes * 24 * 60 * 60 * 1000),
  })
  // Todas pagaron la seña; las canceladas se cancelaron a tiempo y se devolvió
  pagos.push({
    reservaId,
    monto: precioTurno.mul(cancha.porcentajeSena).div(100),
    porcentaje: cancha.porcentajeSena,
    cancellationHours: cancha.cancellationHours,
    devuelto: cancelada,
  })

  turnosOcupados.add(`${cancha.id} ${fecha} ${turno.horaInicio}`)
  jugadoresOcupados.add(`${jugadorId} ${fecha} ${turno.horaInicio}`)
}

// ---------- Seed ----------

async function main() {
  const password = process.env.DEMO_PASSWORD
  if (!password) {
    throw new Error('Falta DEMO_PASSWORD (la contraseña de todas las cuentas de la demo)')
  }
  const passwordHash = await hashPassword(password)

  // Freno de seguridad: si hay usuarios que no son de la demo (por ejemplo,
  // es la base compartida de dev), no borra nada.
  const usuariosAjenos = await db.usuario.count({
    where: { NOT: { email: { endsWith: '@tocayjuga.com' } } },
  })
  if (usuariosAjenos > 0) {
    throw new Error(
      `La base tiene ${usuariosAjenos} usuarios que no son de la demo: no parece la base de la demo, no se borra nada.`,
    )
  }

  await borrarTodo()

  // ----- Usuarios -----
  let numeroDeDni = 30111000
  const idDeDuenio = new Map<string, string>()
  for (const duenio of DUENIOS) {
    const usuario = await db.usuario.create({
      data: { ...duenio, passwordHash, rol: 'DUENIO', dni: String(numeroDeDni++) },
    })
    idDeDuenio.set(duenio.email, usuario.id)
  }

  const idsDeJugadores: string[] = []
  for (const jugador of JUGADORES) {
    const dni = String(numeroDeDni++)
    const usuario = await db.usuario.create({
      data: {
        ...jugador,
        passwordHash,
        rol: 'JUGADOR',
        dni,
        telefono: `11 6000-${dni.slice(-4)}`,
      },
    })
    idsDeJugadores.push(usuario.id)
  }

  // ----- Complejos, canchas y precios nocturnos -----
  const canchas: CanchaCreada[] = []
  for (const complejo of COMPLEJOS) {
    const complejoCreado = await db.complejo.create({
      data: {
        nombre: complejo.nombre,
        direccion: complejo.direccion,
        zona: complejo.zona,
        contacto: complejo.contacto,
        duenioId: idDeDuenio.get(complejo.duenioEmail)!,
        porcentajeSenaDefault: complejo.porcentajeSena,
        cancellationHours: complejo.cancellationHours,
        imagenes: {
          create: complejo.fotos.map((url, orden) => ({ url, orden })),
        },
      },
    })

    for (const cancha of complejo.canchas) {
      const { precioNocturno, ...datosDeCancha } = cancha
      const canchaCreada = await db.cancha.create({
        data: { complejoId: complejoCreado.id, ...datosDeCancha },
      })
      if (precioNocturno) {
        await db.precioEspecial.create({
          data: {
            canchaId: canchaCreada.id,
            horaInicio: '19:00',
            horaFin: '23:00',
            precio: precioNocturno,
          },
        })
      }
      canchas.push({
        id: canchaCreada.id,
        complejo: complejo.nombre,
        nombre: cancha.nombre,
        precioBase: canchaCreada.precioBase,
        precioNocturno,
        horaApertura: cancha.horaApertura,
        horaCierre: cancha.horaCierre,
        duracionTurnoMin: cancha.duracionTurnoMin,
        porcentajeSena: complejo.porcentajeSena,
        cancellationHours: complejo.cancellationHours,
      })
    }
  }

  function buscarCancha(complejo: string, nombre: string): CanchaCreada {
    const cancha = canchas.find((c) => c.complejo === complejo && c.nombre === nombre)
    if (!cancha) throw new Error(`No existe ${complejo} / ${nombre}`)
    return cancha
  }

  // ----- Reservas de jugador@tocayjuga.com (van primero, así el relleno no les gana el turno) -----
  const juan = idsDeJugadores[0]
  const palermo1 = buscarCancha('Distrito Fútbol Palermo', 'Cancha 1')
  const palermo3 = buscarCancha('Distrito Fútbol Palermo', 'Cancha 3')
  const padel1 = buscarCancha('Belgrano Racket Club', 'Pádel 1')
  agregarReserva(palermo1, juan, -18, '20:00')
  agregarReserva(buscarCancha('La Redonda Núñez', 'Cancha 1'), juan, -14, '21:00')
  agregarReserva(buscarCancha('Almagro Fútbol 5', 'Techada'), juan, -9, '21:00', true)
  agregarReserva(palermo3, juan, -7, '20:00')
  agregarReserva(padel1, juan, -4, '20:00')
  agregarReserva(palermo1, juan, 1, '21:00')
  agregarReserva(padel1, juan, 3, '20:00')
  agregarReserva(buscarCancha('Fútbol Norte Olivos', 'Cancha A'), juan, 6, '19:00')

  // ----- Relleno: el resto de los jugadores ocupa la agenda -----
  const otrosJugadores = idsDeJugadores.slice(1)
  for (const cancha of canchas) {
    const turnos = generateSlots(cancha.horaApertura, cancha.horaCierre, cancha.duracionTurnoMin)
    for (let diasDesdeHoy = -DIAS_DE_HISTORIAL; diasDesdeHoy <= DIAS_DE_AGENDA; diasDesdeHoy++) {
      const fecha = dia(diasDesdeHoy)
      for (const turno of turnos) {
        if (turnosOcupados.has(`${cancha.id} ${fecha} ${turno.horaInicio}`)) continue
        if (Math.random() > probabilidadDeOcupacion(turno.horaInicio)) continue

        // Un jugador al azar que no tenga otro partido a esa hora
        const primero = Math.floor(Math.random() * otrosJugadores.length)
        for (let i = 0; i < otrosJugadores.length; i++) {
          const jugadorId = otrosJugadores[(primero + i) % otrosJugadores.length]
          if (!jugadoresOcupados.has(`${jugadorId} ${fecha} ${turno.horaInicio}`)) {
            agregarReserva(cancha, jugadorId, diasDesdeHoy, turno.horaInicio, Math.random() < 0.06)
            break
          }
        }
      }
    }
  }

  // De a 1000 para no pasarse del límite de parámetros de Postgres
  for (let i = 0; i < reservas.length; i += 1000) {
    await db.reserva.createMany({ data: reservas.slice(i, i + 1000) })
  }
  for (let i = 0; i < pagos.length; i += 1000) {
    await db.pago.createMany({ data: pagos.slice(i, i + 1000) })
  }

  console.log(`
Seed de demo listo (se borró todo lo que había antes).

  ${COMPLEJOS.length} complejos, ${canchas.length} canchas, ${reservas.length} reservas
  Contraseña de todas las cuentas: la de DEMO_PASSWORD

  DUEÑO     dueno@tocayjuga.com     Palermo, Núñez y Almagro
  JUGADOR   jugador@tocayjuga.com   historial de partidos y 3 turnos próximos
`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })
