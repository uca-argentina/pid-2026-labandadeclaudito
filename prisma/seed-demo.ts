// Datos para mostrarle la app a un cliente (base de prod, tocayjuga.com).
// Antes de correrlo, la base tiene que tener todas las migraciones:
//   DATABASE_URL=<url de prod> npx prisma migrate deploy
// Y después (DATABASE_URL tiene que ser la de prod: `vercel env run` NO sirve
// desde el repo, porque el DATABASE_URL del .env local le gana):
//   DEMO_PASSWORD=<clave> DATABASE_URL=<url de prod> npm run db:seed-demo
//
// A diferencia de prisma/seed.ts (casos de QA para la base de dev), acá los
// complejos son reales: nombre, dirección, barrio, teléfono y tipo de canchas
// salen de su ficha en haypartido.com.ar (consultadas el 2026-10-15). Se
// cargan solo algunas de sus canchas, y no las de fútbol 6, 8 o 9 (no existen
// en la app). Precios, horarios y % de seña no están publicados: son valores
// de referencia. Las fotos son de Unsplash, no del complejo.
//
// Tiene un poco de cada caso de la app (pendientes de pago, en curso,
// finalizadas sin marcar, asistió, no-show, disputas abiertas, ganadas y
// perdidas, canceladas con y sin devolución, bloqueos, cancha dada de baja,
// complejos por aprobar y rechazados, cuentas suspendidas) y unas 250 reservas
// de relleno para que las agendas no se vean vacías.
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
import { diaDeHoy, diaSemanaDeReserva, generateSlots, momentoActual } from '@/lib/time'
import { Prisma } from '@/lib/generated/prisma/client'
import type {
  DecisionDisputa,
  Deporte,
  EstadoAprobacion,
  EstadoReserva,
  TipoSuperficie,
} from '@/lib/generated/prisma/client'

// Relleno desde hace 10 días hasta dentro de 5
const DIAS_DE_HISTORIAL = 10
const DIAS_DE_AGENDA = 5
const MS_POR_DIA = 24 * 60 * 60 * 1000

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

function avatar(id: string): string {
  return `https://images.unsplash.com/${id}?w=256&h=256&fit=crop&crop=faces&q=80`
}

async function borrarTodo() {
  await db.evidenciaDisputa.deleteMany()
  await db.disputa.deleteMany()
  await db.pago.deleteMany()
  await db.reserva.deleteMany()
  await db.block.deleteMany()
  await db.precioEspecial.deleteMany()
  await db.imagenComplejo.deleteMany()
  await db.cancha.deleteMany()
  await db.complejo.deleteMany()
  await db.intento.deleteMany()
  await db.usuario.deleteMany()
}

// Después de las 19 se llena más, a la tarde algo y a la mañana casi nada
function probabilidadDeOcupacion(horaInicio: string): number {
  const hora = Number(horaInicio.slice(0, 2))
  if (hora >= 19) return 0.12
  if (hora >= 12) return 0.02
  return 0.01
}

// ---------- Usuarios ----------

type UsuarioDemo = {
  nombre: string
  email: string
  imagenUrl?: string
  activo?: boolean
}

const DUENIOS: UsuarioDemo[] = [
  {
    nombre: 'Martín Gómez',
    email: 'dueno@tocayjuga.com',
    imagenUrl: avatar('photo-1507003211169-0a1dd7228f2d'),
  },
  {
    nombre: 'Laura Fernández',
    email: 'laura.fernandez@tocayjuga.com',
    imagenUrl: avatar('photo-1494790108377-be9c29b29330'),
  },
  {
    nombre: 'Diego Sosa',
    email: 'diego.sosa@tocayjuga.com',
    imagenUrl: avatar('photo-1500648767791-00dcc994a43e'),
  },
  {
    nombre: 'Sofía Paz',
    email: 'sofia.paz@tocayjuga.com',
    imagenUrl: avatar('photo-1438761681033-6461ffad8d80'),
  },
  // Suspendido: su complejo (aprobado) deja de verse en la búsqueda
  {
    nombre: 'Carlos Vega',
    email: 'carlos.vega@tocayjuga.com',
    imagenUrl: avatar('photo-1472099645785-5658abf4ff4e'),
    activo: false,
  },
]

// El primero es el jugador de la demo. Los dos sin foto muestran las iniciales.
const JUGADORES: UsuarioDemo[] = [
  {
    nombre: 'Juan Pérez',
    email: 'jugador@tocayjuga.com',
    imagenUrl: avatar('photo-1506794778202-cad84cf45f1d'),
  },
  {
    nombre: 'Lucas Martínez',
    email: 'lucas.martinez@tocayjuga.com',
    imagenUrl: avatar('photo-1539571696357-5a69c17a67c6'),
  },
  {
    nombre: 'Agustina Romero',
    email: 'agustina.romero@tocayjuga.com',
    imagenUrl: avatar('photo-1534528741775-53994a69daeb'),
  },
  {
    nombre: 'Tomás Álvarez',
    email: 'tomas.alvarez@tocayjuga.com',
    imagenUrl: avatar('photo-1531427186611-ecfd6d936c79'),
  },
  {
    nombre: 'Valentina Torres',
    email: 'valentina.torres@tocayjuga.com',
    imagenUrl: avatar('photo-1544005313-94ddf0286df2'),
  },
  {
    nombre: 'Nicolás Benítez',
    email: 'nicolas.benitez@tocayjuga.com',
    imagenUrl: avatar('photo-1599566150163-29194dcaad36'),
  },
  {
    nombre: 'Martina Acosta',
    email: 'martina.acosta@tocayjuga.com',
    imagenUrl: avatar('photo-1517841905240-472988babdf9'),
  },
  {
    nombre: 'Federico Díaz',
    email: 'federico.diaz@tocayjuga.com',
    imagenUrl: avatar('photo-1527980965255-d3b416303d12'),
  },
  { nombre: 'Santiago Herrera', email: 'santiago.herrera@tocayjuga.com' },
  { nombre: 'Julieta Medina', email: 'julieta.medina@tocayjuga.com' },
  // Suspendido: tiene historial pero ya no puede entrar
  {
    nombre: 'Pablo Suárez',
    email: 'pablo.suarez@tocayjuga.com',
    imagenUrl: avatar('photo-1580489944761-15a19d654956'),
    activo: false,
  },
]

// ---------- Complejos ----------

type PrecioEspecialDemo = {
  diaSemana: number | null
  horaInicio: string | null
  horaFin: string | null
  precio: number
}

type CanchaDemo = {
  nombre: string
  deporte: Deporte
  tipoSuperficie: TipoSuperficie
  capacidad: number
  precioBase: number
  horaApertura: string
  horaCierre: string
  duracionTurnoMin: number
  porcentajeSena?: number
  minAdvanceMinutes?: number
  activo?: boolean
  precios?: PrecioEspecialDemo[]
}

type ComplejoDemo = {
  nombre: string
  direccion: string
  zona: string
  contacto: string
  duenioEmail: string
  estadoAprobacion: EstadoAprobacion
  motivoRechazo?: string
  porcentajeSena: number
  cancellationHours: number
  fotos: string[]
  canchas: CanchaDemo[]
}

// De 19 a 23, todos los días
function nocturno(precio: number): PrecioEspecialDemo[] {
  return [{ diaSemana: null, horaInicio: '19:00', horaFin: '23:00', precio }]
}

const FUTBOL_5: Omit<CanchaDemo, 'nombre'> = {
  deporte: 'FUTBOL_5',
  tipoSuperficie: 'CESPED_SINTETICO',
  capacidad: 10,
  precioBase: 60000,
  horaApertura: '09:00',
  horaCierre: '00:00',
  duracionTurnoMin: 60,
  precios: nocturno(75000),
}

const FUTBOL_7: Omit<CanchaDemo, 'nombre'> = {
  deporte: 'FUTBOL_7',
  tipoSuperficie: 'CESPED_SINTETICO',
  capacidad: 14,
  precioBase: 90000,
  horaApertura: '09:00',
  horaCierre: '00:00',
  duracionTurnoMin: 60,
  precios: nocturno(110000),
}

const FUTBOL_11: Omit<CanchaDemo, 'nombre'> = {
  deporte: 'FUTBOL_11',
  tipoSuperficie: 'CESPED_SINTETICO',
  capacidad: 22,
  precioBase: 180000,
  horaApertura: '10:00',
  horaCierre: '22:00',
  duracionTurnoMin: 90,
  // Una cancha de 11 se reserva con un día de anticipación
  minAdvanceMinutes: 24 * 60,
}

const TENIS: Omit<CanchaDemo, 'nombre'> = {
  deporte: 'TENIS',
  tipoSuperficie: 'POLVO_DE_LADRILLO',
  capacidad: 4,
  precioBase: 30000,
  horaApertura: '08:00',
  horaCierre: '22:00',
  duracionTurnoMin: 60,
  // Sábados y domingos, todo el día
  precios: [
    { diaSemana: 6, horaInicio: null, horaFin: null, precio: 36000 },
    { diaSemana: 0, horaInicio: null, horaFin: null, precio: 36000 },
  ],
}

const FOTOS_FUTBOL = [
  foto('photo-1431324155629-1a6deb1dec8d'),
  foto('photo-1624880357913-a8539238245b'),
  foto('photo-1551958219-acbc608c6377'),
  foto('photo-1579952363873-27f3bade9f55'),
  foto('photo-1553778263-73a83bab9b0c'),
  foto('photo-1459865264687-595d652de67e'),
  foto('photo-1574629810360-7efbbe195018'),
  foto('photo-1606925797300-0b35e9d1794e'),
  foto('photo-1600679472829-3044539ce8ed'),
  foto('photo-1560272564-c83b66b1ad12'),
  foto('photo-1511886929837-354d827aae26'),
  foto('photo-1575361204480-aadea25e6e68'),
]
const FOTOS_PADEL = [
  foto('photo-1612534847738-b3af9bc31f0c'),
  foto('photo-1595435934249-5df7ed86e1c0'),
]
const FOTOS_TENIS = [
  foto('photo-1554068865-24cecd4e34b8'),
  foto('photo-1622279457486-62dcc4a431d6'),
]

const COMPLEJOS: ComplejoDemo[] = [
  {
    nombre: 'Salguero Fútbol',
    direccion: 'Av. Costanera Rafael Obligado 1221',
    zona: 'Palermo',
    contacto: '11 5263-3800',
    duenioEmail: 'dueno@tocayjuga.com',
    estadoAprobacion: 'APROBADO',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [FOTOS_FUTBOL[0], FOTOS_FUTBOL[1], FOTOS_FUTBOL[2]],
    canchas: [
      { nombre: 'Cancha 1', ...FUTBOL_5 },
      { nombre: 'Cancha 2', ...FUTBOL_5 },
      { nombre: 'Cancha 3', ...FUTBOL_5 },
      { nombre: 'Cancha 7', ...FUTBOL_7 },
    ],
  },
  {
    nombre: 'Grün FC',
    direccion: 'Av. Crisólogo Larralde 999',
    zona: 'Núñez',
    contacto: '11 2456-2500',
    duenioEmail: 'dueno@tocayjuga.com',
    estadoAprobacion: 'APROBADO',
    porcentajeSena: 30,
    cancellationHours: 12,
    fotos: [FOTOS_FUTBOL[3], FOTOS_FUTBOL[4], FOTOS_PADEL[0]],
    canchas: [
      { nombre: 'Cancha 1', ...FUTBOL_5 },
      { nombre: 'Cancha 2', ...FUTBOL_5 },
      {
        nombre: 'Pádel',
        deporte: 'PADEL',
        tipoSuperficie: 'CEMENTO',
        capacidad: 4,
        precioBase: 40000,
        horaApertura: '08:00',
        horaCierre: '00:00',
        duracionTurnoMin: 90,
        // Pisa el 30% del complejo
        porcentajeSena: 50,
        precios: nocturno(48000),
      },
    ],
  },
  {
    nombre: 'Caballito Norte',
    direccion: 'Av. Avellaneda 1423',
    zona: 'Caballito',
    contacto: '11 2365-7698',
    duenioEmail: 'dueno@tocayjuga.com',
    estadoAprobacion: 'APROBADO',
    porcentajeSena: 25,
    // Su reglamento pide avisar 72 hs antes si no se puede ir
    cancellationHours: 72,
    fotos: [FOTOS_FUTBOL[5], FOTOS_FUTBOL[6]],
    canchas: [
      { nombre: 'Cancha 1', ...FUTBOL_5 },
      { nombre: 'Cancha 2', ...FUTBOL_5 },
      // Dada de baja: conserva su historial pero no se puede reservar
      { nombre: 'Cancha 3', ...FUTBOL_5, activo: false },
    ],
  },
  {
    nombre: 'Club CASA - Tenis y Fútbol',
    direccion: 'Av. Pres. Figueroa Alcorta 7101',
    zona: 'Belgrano',
    contacto: '11 3655-5478',
    duenioEmail: 'laura.fernandez@tocayjuga.com',
    estadoAprobacion: 'APROBADO',
    porcentajeSena: 40,
    cancellationHours: 48,
    fotos: [FOTOS_TENIS[0], FOTOS_TENIS[1], FOTOS_FUTBOL[7]],
    canchas: [
      { nombre: 'Fútbol 11', ...FUTBOL_11 },
      { nombre: 'Fútbol 7', ...FUTBOL_7 },
      { nombre: 'Tenis 1', ...TENIS },
      { nombre: 'Tenis 2', ...TENIS },
      { nombre: 'Tenis Césped', ...TENIS, tipoSuperficie: 'CESPED_NATURAL', precioBase: 38000 },
    ],
  },
  {
    nombre: 'El Polideportivo',
    direccion: 'Av. Crámer 3249',
    zona: 'Núñez',
    contacto: '11 6432-3180',
    duenioEmail: 'diego.sosa@tocayjuga.com',
    estadoAprobacion: 'APROBADO',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [FOTOS_FUTBOL[8], FOTOS_FUTBOL[9]],
    canchas: [
      { nombre: 'Cancha 1', ...FUTBOL_5 },
      { nombre: 'Cancha 2', ...FUTBOL_5 },
      {
        nombre: 'Cancha 3',
        ...FUTBOL_5,
        tipoSuperficie: 'CEMENTO',
        precioBase: 45000,
        precios: nocturno(55000),
      },
      { nombre: 'Fútbol 11', ...FUTBOL_11 },
    ],
  },
  {
    nombre: 'Nueva Generación - Sede Boedo',
    direccion: 'Quintino Bocayuva 1241',
    zona: 'Boedo',
    contacto: '11 3259-9787',
    duenioEmail: 'diego.sosa@tocayjuga.com',
    estadoAprobacion: 'APROBADO',
    porcentajeSena: 20,
    cancellationHours: 24,
    fotos: [FOTOS_FUTBOL[10]],
    canchas: [
      {
        nombre: 'Cancha 1',
        ...FUTBOL_5,
        tipoSuperficie: 'CEMENTO',
        precioBase: 45000,
        precios: nocturno(55000),
      },
      {
        nombre: 'Cancha 2',
        ...FUTBOL_5,
        tipoSuperficie: 'CEMENTO',
        precioBase: 45000,
        precios: nocturno(55000),
      },
    ],
  },
  // Aprobado, pero el dueño está suspendido: no lo ve ningún jugador
  {
    nombre: 'Complejo Gustavo Costas - Boedo 5',
    direccion: 'Av. Boedo 47',
    zona: 'Almagro',
    contacto: '11 3619-9782',
    duenioEmail: 'carlos.vega@tocayjuga.com',
    estadoAprobacion: 'APROBADO',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [FOTOS_FUTBOL[11]],
    canchas: [{ nombre: 'Cancha 1', ...FUTBOL_7 }],
  },
  // Esperando revisión en /admin/complejos
  {
    nombre: 'Marangoni Fútbol y Deporte',
    direccion: 'Av. Cnel. Díaz 2300',
    zona: 'Palermo',
    contacto: '11 4804-0524',
    duenioEmail: 'laura.fernandez@tocayjuga.com',
    estadoAprobacion: 'PENDIENTE',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [FOTOS_FUTBOL[2]],
    canchas: [{ nombre: 'Cancha 1', ...FUTBOL_5 }],
  },
  {
    nombre: 'Campus Sport Arena',
    direccion: 'Maza 754',
    zona: 'Almagro',
    contacto: '11 4956-0717',
    duenioEmail: 'sofia.paz@tocayjuga.com',
    estadoAprobacion: 'PENDIENTE',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [FOTOS_FUTBOL[4], FOTOS_FUTBOL[0]],
    canchas: [
      { nombre: 'Cancha 1', ...FUTBOL_5 },
      { nombre: 'Cancha 2', ...FUTBOL_5 },
    ],
  },
  // Rechazado: la dueña lo ve con el motivo para corregirlo
  {
    nombre: 'Club Social y Deportivo Villa Malcolm',
    direccion: 'Av. Córdoba 5064',
    zona: 'Villa Crespo',
    contacto: '11 5107-6616',
    duenioEmail: 'sofia.paz@tocayjuga.com',
    estadoAprobacion: 'RECHAZADO',
    motivoRechazo:
      'Faltan fotos de las canchas: subí al menos una para que los jugadores vean cómo es el complejo.',
    porcentajeSena: 30,
    cancellationHours: 24,
    fotos: [],
    canchas: [
      { nombre: 'Cancha 1', ...FUTBOL_5 },
      { nombre: 'Cancha 2', ...FUTBOL_5 },
    ],
  },
]

// ---------- Reservas ----------

// Lo que hace falta de una cancha ya creada para armar sus reservas
type CanchaCreada = {
  id: string
  complejo: string
  nombre: string
  activa: boolean
  aprobado: boolean
  // Aprobado y de un dueño activo: el único que recibe reservas futuras
  visible: boolean
  precioBase: Prisma.Decimal
  precios: PrecioEspecialDemo[]
  horaApertura: string
  horaCierre: string
  duracionTurnoMin: number
  porcentajeSena: number
  cancellationHours: number
}

type BloqueoDemo = {
  canchaId: string
  desde: string
  hasta: string
  startTime: string
  endTime: string
}

// Las reservas se juntan acá y se insertan todas juntas al final
const reservas: Prisma.ReservaCreateManyInput[] = []
const pagos: Prisma.PagoCreateManyInput[] = []
const bloqueos: BloqueoDemo[] = []
// "canchaId fecha hora": para no reservar dos veces el mismo turno
const turnosOcupados = new Set<string>()
// "jugadorId fecha hora": para que un jugador no esté en dos canchas a la vez.
// ponytail: compara solo la hora de inicio, no ve un turno de 90 min que pisa
// a uno de 60 que empieza media hora después (no se nota en la demo).
const jugadoresOcupados = new Set<string>()

// Mismo criterio que lib/blocks: fin "00:00" es medianoche
function estaBloqueado(canchaId: string, fecha: string, horaInicio: string, horaFin: string) {
  const fin = horaFin === '00:00' ? '24:00' : horaFin
  return bloqueos.some(
    (b) =>
      b.canchaId === canchaId &&
      fecha >= b.desde &&
      fecha <= b.hasta &&
      b.startTime < fin &&
      horaInicio < b.endTime,
  )
}

type OpcionesDeReserva = {
  estado?: EstadoReserva
  // undefined = la decide agregarReserva según la fecha
  asistio?: boolean | null
  // Sin seña: las PENDIENTE y las canceladas antes de pagar
  sena?: 'pagada' | 'devuelta' | 'no devuelta' | null
  creadaHaceMinutos?: number
}

// Mismo cálculo de precio y seña que POST /api/bookings y su /deposit
function agregarReserva(
  cancha: CanchaCreada,
  jugadorId: string,
  diasDesdeHoy: number,
  horaInicio: string,
  opciones: OpcionesDeReserva = {},
) {
  const fecha = dia(diasDesdeHoy)
  const turnos = generateSlots(cancha.horaApertura, cancha.horaCierre, cancha.duracionTurnoMin)
  const turno = turnos.find((t) => t.horaInicio === horaInicio)
  if (!turno) {
    throw new Error(`${horaInicio} no es un turno de ${cancha.complejo} / ${cancha.nombre}`)
  }
  const estado = opciones.estado ?? 'CONFIRMADA'
  if (estado !== 'CANCELADA' && turnosOcupados.has(`${cancha.id} ${fecha} ${turno.horaInicio}`)) {
    throw new Error(
      `${cancha.complejo} / ${cancha.nombre} ya está reservada el ${fecha} ${horaInicio}`,
    )
  }

  const precioTurno = precioProporcional(
    precioDelTurno(
      cancha.precioBase,
      cancha.precios.map((p) => ({ ...p, precio: new Prisma.Decimal(p.precio) })),
      diaSemanaDeReserva(new Date(fecha)),
      turno.horaInicio,
    ),
    turno.horaInicio,
    turno.horaFin,
    cancha.duracionTurnoMin,
  )

  // Turno de hace 3 días o más: el dueño ya marcó (casi todos fueron). Más
  // reciente o futuro: todavía sin marcar, así el dueño tiene para marcar.
  let asistio = opciones.asistio
  if (asistio === undefined) {
    asistio = null
    if (diasDesdeHoy <= -3 && estado === 'CONFIRMADA') asistio = Math.random() < 0.92
  }

  let sena = opciones.sena
  if (sena === undefined) {
    sena = null
    if (estado === 'CONFIRMADA') sena = 'pagada'
    if (estado === 'CANCELADA') sena = 'devuelta'
  }

  // Pedida un par de días antes del turno (nunca en el futuro)
  let creadaEn = new Date(Date.now() - (Math.max(-diasDesdeHoy, 0) + 2) * MS_POR_DIA)
  if (opciones.creadaHaceMinutos !== undefined) {
    creadaEn = new Date(Date.now() - opciones.creadaHaceMinutos * 60 * 1000)
  }

  // El dueño marca al día siguiente del turno. Desde ahí corren los 7 días
  // para disputar un no-show.
  let asistenciaMarcadaEn: Date | null = null
  if (asistio !== null) {
    const alOtroDia = new Date(`${dia(diasDesdeHoy + 1)}T15:00:00.000Z`)
    asistenciaMarcadaEn = alOtroDia.getTime() < Date.now() ? alOtroDia : new Date()
  }

  const reservaId = randomUUID()
  reservas.push({
    id: reservaId,
    canchaId: cancha.id,
    jugadorId,
    fecha: new Date(fecha),
    horaInicio: turno.horaInicio,
    horaFin: turno.horaFin,
    estado,
    asistio,
    asistenciaMarcadaEn,
    precioTurno,
    createdAt: creadaEn,
  })
  if (sena) {
    pagos.push({
      reservaId,
      monto: precioTurno.mul(cancha.porcentajeSena).div(100),
      porcentaje: cancha.porcentajeSena,
      cancellationHours: cancha.cancellationHours,
      devuelto: sena === 'devuelta',
      createdAt: creadaEn,
    })
  }

  if (estado !== 'CANCELADA') {
    turnosOcupados.add(`${cancha.id} ${fecha} ${turno.horaInicio}`)
    jugadoresOcupados.add(`${jugadorId} ${fecha} ${turno.horaInicio}`)
  }

  return reservaId
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
  const admin = await db.usuario.create({
    data: {
      nombre: 'Admin TocaYJuga',
      email: 'admin@tocayjuga.com',
      passwordHash,
      rol: 'ADMIN',
    },
  })

  let numeroDeDni = 30111000
  const idPorEmail = new Map<string, string>()
  async function crearUsuarios(usuarios: UsuarioDemo[], rol: 'DUENIO' | 'JUGADOR') {
    for (const usuario of usuarios) {
      const dni = String(numeroDeDni++)
      const creado = await db.usuario.create({
        data: { ...usuario, passwordHash, rol, dni, telefono: `11 6000-${dni.slice(-4)}` },
      })
      idPorEmail.set(usuario.email, creado.id)
    }
  }
  await crearUsuarios(DUENIOS, 'DUENIO')
  await crearUsuarios(JUGADORES, 'JUGADOR')

  function idDe(email: string): string {
    const id = idPorEmail.get(email)
    if (!id) throw new Error(`No existe el usuario ${email}`)
    return id
  }

  // ----- Complejos, canchas y precios especiales -----
  const canchas: CanchaCreada[] = []
  for (const complejo of COMPLEJOS) {
    const duenio = DUENIOS.find((d) => d.email === complejo.duenioEmail)!
    const complejoCreado = await db.complejo.create({
      data: {
        nombre: complejo.nombre,
        direccion: complejo.direccion,
        zona: complejo.zona,
        contacto: complejo.contacto,
        duenioId: idDe(complejo.duenioEmail),
        estadoAprobacion: complejo.estadoAprobacion,
        motivoRechazo: complejo.motivoRechazo,
        porcentajeSenaDefault: complejo.porcentajeSena,
        cancellationHours: complejo.cancellationHours,
        // Los aprobados se cargaron hace un mes; los demás, hace unos días
        createdAt: new Date(
          Date.now() - (complejo.estadoAprobacion === 'APROBADO' ? 30 : 3) * MS_POR_DIA,
        ),
        imagenes: { create: complejo.fotos.map((url, orden) => ({ url, orden })) },
      },
    })

    for (const cancha of complejo.canchas) {
      const { precios = [], ...datosDeCancha } = cancha
      const canchaCreada = await db.cancha.create({
        data: {
          complejoId: complejoCreado.id,
          ...datosDeCancha,
          preciosEspeciales: { create: precios },
        },
      })
      canchas.push({
        id: canchaCreada.id,
        complejo: complejo.nombre,
        nombre: cancha.nombre,
        activa: cancha.activo !== false,
        aprobado: complejo.estadoAprobacion === 'APROBADO',
        visible: complejo.estadoAprobacion === 'APROBADO' && duenio.activo !== false,
        precioBase: canchaCreada.precioBase,
        precios,
        horaApertura: cancha.horaApertura,
        horaCierre: cancha.horaCierre,
        duracionTurnoMin: cancha.duracionTurnoMin,
        porcentajeSena: cancha.porcentajeSena ?? complejo.porcentajeSena,
        cancellationHours: complejo.cancellationHours,
      })
    }
  }

  function buscarCancha(complejo: string, nombre: string): CanchaCreada {
    const cancha = canchas.find((c) => c.complejo === complejo && c.nombre === nombre)
    if (!cancha) throw new Error(`No existe ${complejo} / ${nombre}`)
    return cancha
  }

  const salguero1 = buscarCancha('Salguero Fútbol', 'Cancha 1')
  const salguero2 = buscarCancha('Salguero Fútbol', 'Cancha 2')
  const salguero3 = buscarCancha('Salguero Fútbol', 'Cancha 3')
  const salguero7 = buscarCancha('Salguero Fútbol', 'Cancha 7')
  const grun1 = buscarCancha('Grün FC', 'Cancha 1')
  const grun2 = buscarCancha('Grün FC', 'Cancha 2')
  const grunPadel = buscarCancha('Grün FC', 'Pádel')
  const caballito1 = buscarCancha('Caballito Norte', 'Cancha 1')
  const caballito2 = buscarCancha('Caballito Norte', 'Cancha 2')
  const caballito3 = buscarCancha('Caballito Norte', 'Cancha 3')
  const casa11 = buscarCancha('Club CASA - Tenis y Fútbol', 'Fútbol 11')
  const casa7 = buscarCancha('Club CASA - Tenis y Fútbol', 'Fútbol 7')
  const casaTenis1 = buscarCancha('Club CASA - Tenis y Fútbol', 'Tenis 1')
  const casaTenis2 = buscarCancha('Club CASA - Tenis y Fútbol', 'Tenis 2')
  const poli1 = buscarCancha('El Polideportivo', 'Cancha 1')
  const poli2 = buscarCancha('El Polideportivo', 'Cancha 2')
  const quintino1 = buscarCancha('Nueva Generación - Sede Boedo', 'Cancha 1')
  const costas = buscarCancha('Complejo Gustavo Costas - Boedo 5', 'Cancha 1')

  // ----- Bloqueos (van antes que las reservas, así el relleno los respeta) -----
  // Uno vigente de varios días, uno de un día próximo y uno ya pasado
  bloqueos.push(
    {
      canchaId: salguero2.id,
      desde: dia(0),
      hasta: dia(6),
      startTime: '19:00',
      endTime: '23:00',
    },
    { canchaId: grun1.id, desde: dia(2), hasta: dia(3), startTime: '09:00', endTime: '13:00' },
    { canchaId: casa11.id, desde: dia(-7), hasta: dia(-5), startTime: '10:00', endTime: '22:00' },
  )
  const motivos = [
    'Torneo nocturno de la liga del complejo',
    'Mantenimiento del césped',
    'Uso interno: escuelita de fútbol',
  ]
  await db.block.createMany({
    data: bloqueos.map((b, i) => ({
      courtId: b.canchaId,
      startDate: new Date(b.desde),
      endDate: new Date(b.hasta),
      startTime: b.startTime,
      endTime: b.endTime,
      reason: motivos[i],
    })),
  })

  // ----- Reservas de jugador@tocayjuga.com: un caso de cada cosa -----
  const juan = idDe('jugador@tocayjuga.com')
  // No-show de hace más de 7 días: ya no se puede disputar
  agregarReserva(casaTenis1, juan, -13, '10:00', { asistio: false })
  agregarReserva(poli1, juan, -12, '21:00', { asistio: true })
  const disputaPerdida = agregarReserva(salguero1, juan, -11, '20:00', { asistio: false })
  const disputaGanada = agregarReserva(grunPadel, juan, -10, '20:00', { asistio: true })
  // Canceló tarde: perdió la seña
  agregarReserva(caballito1, juan, -9, '21:00', { estado: 'CANCELADA', sena: 'no devuelta' })
  // Jugó en el complejo del dueño que después suspendieron
  agregarReserva(costas, juan, -8, '21:00', { asistio: true })
  agregarReserva(salguero7, juan, -7, '20:00', { asistio: true })
  agregarReserva(casa7, juan, -5, '19:00', { estado: 'CANCELADA', sena: 'devuelta' })
  const disputaAbierta = agregarReserva(poli1, juan, -4, '20:00', { asistio: false })
  agregarReserva(salguero3, juan, -3, '21:00', { asistio: true })
  // No-show reciente, todavía en plazo: muestra el botón "Disputar"
  agregarReserva(grun2, juan, -2, '20:00', { asistio: false })
  // Finalizada: el dueño todavía no marcó la asistencia
  agregarReserva(salguero1, juan, -1, '21:00', { asistio: null })

  // En curso: el turno de la hora actual, si el complejo está abierto
  const horaActual = Number(momentoActual().hora.slice(0, 2))
  if (horaActual >= 9 && horaActual <= 23) {
    agregarReserva(salguero3, juan, 0, `${String(horaActual).padStart(2, '0')}:00`)
  }

  agregarReserva(salguero1, juan, 1, '21:00')
  // Pendiente de pago: la seña vence 15 minutos después de correr el seed
  agregarReserva(caballito2, juan, 2, '20:00', { estado: 'PENDIENTE', creadaHaceMinutos: 1 })
  agregarReserva(casaTenis2, juan, 2, '18:00', { estado: 'CANCELADA', sena: 'devuelta' })
  agregarReserva(grunPadel, juan, 3, '20:00')
  // La pidió y la canceló antes de pagar la seña
  agregarReserva(quintino1, juan, 4, '19:00', { estado: 'CANCELADA', sena: null })
  agregarReserva(poli1, juan, 5, '21:00')
  agregarReserva(casaTenis1, juan, 6, '10:00')

  // ----- Otros casos -----
  // Pendiente de otro jugador, para que el dueño la vea en su agenda
  agregarReserva(grun1, idDe('lucas.martinez@tocayjuga.com'), 1, '19:00', {
    estado: 'PENDIENTE',
    creadaHaceMinutos: 5,
  })
  const disputaDeValentina = agregarReserva(
    quintino1,
    idDe('valentina.torres@tocayjuga.com'),
    -3,
    '21:00',
    { asistio: false },
  )
  // El jugador suspendido tiene historial en los complejos
  const pablo = idDe('pablo.suarez@tocayjuga.com')
  agregarReserva(salguero1, pablo, -6, '19:00', { asistio: true })
  agregarReserva(poli2, pablo, -8, '20:00', { asistio: false })
  // La cancha dada de baja conserva sus reservas viejas
  agregarReserva(caballito3, idDe('agustina.romero@tocayjuga.com'), -6, '20:00', {
    asistio: true,
  })
  agregarReserva(caballito3, idDe('tomas.alvarez@tocayjuga.com'), -4, '21:00', { asistio: true })

  // ----- Relleno -----
  // Los jugadores activos, menos Juan (sus reservas son las de arriba)
  const otrosJugadores = JUGADORES.filter((j) => j.activo !== false)
    .slice(1)
    .map((j) => idDe(j.email))
  for (const cancha of canchas) {
    // Uno sin aprobar nunca recibió reservas
    if (!cancha.activa || !cancha.aprobado) continue
    // El del dueño suspendido solo tiene historial
    const ultimoDia = cancha.visible ? DIAS_DE_AGENDA : -1
    const turnos = generateSlots(cancha.horaApertura, cancha.horaCierre, cancha.duracionTurnoMin)
    for (let diasDesdeHoy = -DIAS_DE_HISTORIAL; diasDesdeHoy <= ultimoDia; diasDesdeHoy++) {
      const fecha = dia(diasDesdeHoy)
      for (const turno of turnos) {
        if (turnosOcupados.has(`${cancha.id} ${fecha} ${turno.horaInicio}`)) continue
        if (estaBloqueado(cancha.id, fecha, turno.horaInicio, turno.horaFin)) continue
        if (Math.random() > probabilidadDeOcupacion(turno.horaInicio)) continue

        // Un jugador al azar que no tenga otro partido a esa hora
        const primero = Math.floor(Math.random() * otrosJugadores.length)
        for (let i = 0; i < otrosJugadores.length; i++) {
          const jugadorId = otrosJugadores[(primero + i) % otrosJugadores.length]
          if (!jugadoresOcupados.has(`${jugadorId} ${fecha} ${turno.horaInicio}`)) {
            const cancelada = Math.random() < 0.07
            agregarReserva(cancha, jugadorId, diasDesdeHoy, turno.horaInicio, {
              estado: cancelada ? 'CANCELADA' : 'CONFIRMADA',
            })
            break
          }
        }
      }
    }
  }

  // Todas juntas: de a una serían cientos de idas y vueltas a la base
  await db.reserva.createMany({ data: reservas })
  await db.pago.createMany({ data: pagos })

  // ----- Disputas -----
  // Resolución null = sigue abierta, para resolverla en /admin/disputas
  async function agregarDisputa(
    reservaId: string,
    jugadorId: string,
    diasDesdeHoy: number,
    descripcion: string,
    evidencias: string[],
    resolucion: { decision: DecisionDisputa; comentarioAdmin: string } | null,
  ) {
    const datos: Prisma.DisputaUncheckedCreateInput = {
      reservaId,
      jugadorId,
      descripcion,
      createdAt: new Date(`${dia(diasDesdeHoy + 2)}T19:00:00.000Z`),
      evidencias: {
        create: evidencias.map((url, orden) => ({ url, tipo: 'IMAGEN' as const, orden })),
      },
    }
    if (resolucion) {
      datos.estado = 'RESUELTA'
      datos.decision = resolucion.decision
      datos.comentarioAdmin = resolucion.comentarioAdmin
      datos.adminId = admin.id
      datos.resueltaEn = new Date(`${dia(diasDesdeHoy + 4)}T14:00:00.000Z`)
    }
    await db.disputa.create({ data: datos })
  }

  await agregarDisputa(
    disputaAbierta,
    juan,
    -4,
    'Llegamos 10 minutos antes y la cancha estaba ocupada por otro grupo. Esperamos media hora y nadie del complejo nos atendió, así que nos fuimos.',
    [FOTOS_FUTBOL[8]],
    null,
  )
  await agregarDisputa(
    disputaDeValentina,
    idDe('valentina.torres@tocayjuga.com'),
    -3,
    'Fuimos y jugamos. Le avisamos al encargado al llegar, no sé por qué figura que no fuimos.',
    [],
    null,
  )
  // Ganada: el admin le dio la razón y la reserva pasó a "asistió"
  await agregarDisputa(
    disputaGanada,
    juan,
    -10,
    'Fuimos y jugamos el partido completo. Tengo la foto de la cancha a la hora del turno.',
    [FOTOS_PADEL[1]],
    {
      decision: 'A_FAVOR_JUGADOR',
      comentarioAdmin:
        'La foto tiene la fecha y la hora del turno y se ve la cancha del complejo. Se da de baja la falta.',
    },
  )
  await agregarDisputa(
    disputaPerdida,
    juan,
    -11,
    'No pudimos ir porque se nos complicó a última hora, pero avisamos por teléfono el mismo día.',
    [],
    {
      decision: 'A_FAVOR_DUENIO',
      comentarioAdmin:
        'El propio reclamo dice que no fueron al turno. Avisar no reemplaza cancelar a tiempo, así que la falta queda.',
    },
  )

  const aprobados = COMPLEJOS.filter((c) => c.estadoAprobacion === 'APROBADO').length
  console.log(`
Seed de demo listo (se borró todo lo que había antes).

  ${COMPLEJOS.length} complejos (${aprobados} aprobados), ${canchas.length} canchas, ${reservas.length} reservas
  Contraseña de todas las cuentas: la de DEMO_PASSWORD

  JUGADOR   jugador@tocayjuga.com   un caso de cada estado y 3 disputas
                                    1 pendiente de pago (vence 15 min después del seed)
  DUEÑO     dueno@tocayjuga.com     Salguero, Grün y Caballito Norte (bloqueos y cancha dada de baja)
  DUEÑA     sofia.paz@tocayjuga.com 1 complejo por aprobar y 1 rechazado
  ADMIN     admin@tocayjuga.com     2 disputas abiertas, 2 complejos por aprobar, 2 cuentas suspendidas
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
