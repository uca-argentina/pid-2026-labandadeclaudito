import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Building2, ChevronRight, Store, User, UserX } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import {
  contarPorGrupo,
  grupoDelEstado,
  reservasDiaPorDia,
  resumirReservas,
  tasa,
  turnosPorHora,
  urlDeReservasGlobales,
} from '@/lib/admin-bookings'
import type { GrupoDeEstado, ReservaResumida } from '@/lib/admin-bookings'
import { pendientesVencidas } from '@/lib/bookings'
import { variacionPorcentual } from '@/lib/dashboard'
import { estadoDeReserva } from '@/lib/estado-reserva'
import { diaEnPalabras, haceCuanto, saludoSegunHora } from '@/lib/fechas'
import { homePorRol } from '@/lib/home-por-rol'
import { formatPrecio } from '@/lib/labels'
import { diaDeHoy, diaDeReserva, momentoActual, sumarDias } from '@/lib/time'
import { ParaResolver } from '@/components/para-resolver'
import { RepartoDeReservas } from '@/components/reparto-de-reservas'
import { ReservasPorDia } from '@/components/reservas-por-dia'
import { TurnosPorHora } from '@/components/turnos-por-hora'
import { VariationBadge } from '@/components/variation-badge'

function altasDeLaSemana(nuevos: number): string {
  if (nuevos === 0) return 'Sin altas en la última semana'
  return `+${nuevos} en la última semana`
}

export default async function AdminHomePage() {
  // El proxy ya filtra por rol, pero la página lo vuelve a chequear
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.rol !== 'ADMIN') redirect(homePorRol(session.user.rol))

  // Se comparan los últimos 7 días (con hoy) contra los 7 anteriores
  const hoy = diaDeHoy()
  const inicioDeLaSemana = sumarDias(hoy, -6)
  const inicioDeLaAnterior = sumarDias(hoy, -13)
  // Medianoche en Argentina (UTC-3, sin horario de verano), para comparar
  // contra createdAt, que es un instante y no un día
  const inicioDeLaSemanaComoInstante = new Date(`${inicioDeLaSemana}T00:00:00-03:00`)

  // Las consultas no dependen entre sí: se hacen a la vez
  const [
    disputasAbiertas,
    disputaMasVieja,
    reservasDeDosSemanas,
    jugadores,
    jugadoresNuevos,
    duenios,
    dueniosNuevos,
    complejosActivos,
    canchasActivas,
    cuentasSuspendidas,
  ] = await Promise.all([
    db.disputa.count({ where: { estado: 'ABIERTA' } }),
    db.disputa.findFirst({
      where: { estado: 'ABIERTA' },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    }),
    // Solo lo que hace falta para saber el estado y el monto
    db.reserva.findMany({
      where: {
        fecha: { gte: new Date(inicioDeLaAnterior), lte: new Date(hoy) },
        NOT: pendientesVencidas(),
      },
      select: {
        estado: true,
        asistio: true,
        fecha: true,
        horaInicio: true,
        horaFin: true,
        precioTurno: true,
      },
    }),
    db.usuario.count({ where: { rol: 'JUGADOR', activo: true } }),
    db.usuario.count({
      where: { rol: 'JUGADOR', activo: true, createdAt: { gte: inicioDeLaSemanaComoInstante } },
    }),
    db.usuario.count({ where: { rol: 'DUENIO', activo: true } }),
    db.usuario.count({
      where: { rol: 'DUENIO', activo: true, createdAt: { gte: inicioDeLaSemanaComoInstante } },
    }),
    db.complejo.count({ where: { activo: true } }),
    db.cancha.count({ where: { activo: true, complejo: { activo: true } } }),
    db.usuario.count({ where: { activo: false } }),
  ])

  // En curso, Finalizada y No se presentó salen del reloj: se calculan acá
  const ahora = momentoActual()
  const reservas: ReservaResumida[] = []
  const turnosDeHoy: { horaInicio: string; grupo: GrupoDeEstado }[] = []
  for (const reserva of reservasDeDosSemanas) {
    const dia = diaDeReserva(reserva.fecha)
    const estado = estadoDeReserva(
      {
        estado: reserva.estado,
        asistio: reserva.asistio,
        dia,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
      },
      ahora,
    )
    const grupo = grupoDelEstado(estado)
    reservas.push({ dia, grupo, precio: Number(reserva.precioTurno) })
    if (dia === hoy) turnosDeHoy.push({ horaInicio: reserva.horaInicio, grupo })
  }

  // Se separan por período: hoy, la última semana y la anterior
  const gruposDeHoy: GrupoDeEstado[] = []
  const deLaSemana: ReservaResumida[] = []
  const deLaAnterior: ReservaResumida[] = []
  for (const reserva of reservas) {
    if (reserva.dia === hoy) gruposDeHoy.push(reserva.grupo)
    if (reserva.dia >= inicioDeLaSemana) {
      deLaSemana.push(reserva)
    } else {
      deLaAnterior.push(reserva)
    }
  }

  const reservasDeHoy = contarPorGrupo(gruposDeHoy)
  const horasDeHoy = turnosPorHora(turnosDeHoy)
  const horaActual = Number(ahora.hora.slice(0, 2))
  const semana = resumirReservas(deLaSemana)
  const anterior = resumirReservas(deLaAnterior)
  const totalesPorDia = reservasDiaPorDia(reservas, inicioDeLaAnterior, 14)

  // Las tasas no llevan variación en %: "+20%" sobre un 10% confunde. Se
  // muestra al lado la de la semana anterior.
  const indicadores = [
    {
      label: 'Reservas',
      valor: semana.reservas.toLocaleString('es-AR'),
      detalle: 'Sin contar las canceladas',
      variacion: variacionPorcentual(semana.reservas, anterior.reservas),
      antes: null,
      subirEsBueno: true,
    },
    {
      label: 'Monto en turnos',
      valor: formatPrecio(Math.round(semana.monto)),
      detalle: 'Valor de los turnos reservados',
      variacion: variacionPorcentual(semana.monto, anterior.monto),
      antes: null,
      subirEsBueno: true,
    },
    {
      label: 'Cancelaciones',
      valor: tasa(semana.canceladas, semana.total),
      detalle: `${semana.canceladas} de ${semana.total} reservas`,
      variacion: null,
      antes: `antes ${tasa(anterior.canceladas, anterior.total)}`,
      subirEsBueno: false,
    },
    {
      label: 'Ausencias',
      valor: tasa(semana.ausentes, semana.terminadas),
      detalle: `${semana.ausentes} de ${semana.terminadas} turnos jugados`,
      variacion: null,
      antes: `antes ${tasa(anterior.ausentes, anterior.terminadas)}`,
      subirEsBueno: false,
    },
  ]

  let bajada = 'Está todo al día: no hay nada esperando tu decisión.'
  if (disputasAbiertas === 1) {
    bajada = 'Hay 1 disputa esperando tu decisión.'
  } else if (disputasAbiertas > 1) {
    bajada = `Hay ${disputasAbiertas} disputas esperando tu decisión.`
  }

  let antiguedadDeLaDisputa = ''
  if (disputaMasVieja !== null) {
    const diaDeLaDisputa = momentoActual(disputaMasVieja.createdAt).dia
    antiguedadDeLaDisputa = haceCuanto(diaDeLaDisputa, hoy)
  }

  // Cada fila de la comunidad lleva al listado que la detalla. Complejos
  // todavía no tiene página (llega con SCRUM-57)
  const comunidad = [
    {
      label: jugadores === 1 ? 'Jugador' : 'Jugadores',
      valor: jugadores,
      detalle: altasDeLaSemana(jugadoresNuevos),
      icono: User,
      color: 'bg-primary/15 text-primary',
      href: '/admin/usuarios?rol=JUGADOR',
    },
    {
      label: duenios === 1 ? 'Dueño' : 'Dueños',
      valor: duenios,
      detalle: altasDeLaSemana(dueniosNuevos),
      icono: Store,
      color: 'bg-clay/15 text-clay-foreground',
      href: '/admin/usuarios?rol=DUENIO',
    },
    {
      label: complejosActivos === 1 ? 'Complejo activo' : 'Complejos activos',
      valor: complejosActivos,
      detalle: `${canchasActivas} ${canchasActivas === 1 ? 'cancha' : 'canchas'} para reservar`,
      icono: Building2,
      color: 'bg-sand text-foreground',
      href: null,
    },
    {
      label: cuentasSuspendidas === 1 ? 'Cuenta suspendida' : 'Cuentas suspendidas',
      valor: cuentasSuspendidas,
      detalle: 'No pueden iniciar sesión',
      icono: UserX,
      color: 'bg-destructive/10 text-destructive',
      href: '/admin/usuarios?filtro=suspendidas',
    },
  ]

  const primerNombre = (session.user.name ?? '').split(' ')[0]

  return (
    <div>
      <div className="mb-7">
        <p className="text-muted-foreground text-sm font-medium">{diaEnPalabras(hoy)}</p>
        <h1 className="font-heading mt-1 text-4xl font-bold tracking-tight">
          ¡{saludoSegunHora()}, {primerNombre}!
        </h1>
        <p className="text-muted-foreground mt-1.5">{bajada}</p>
      </div>

      <ParaResolver
        disputasAbiertas={disputasAbiertas}
        antiguedadDeLaDisputa={antiguedadDeLaDisputa}
      />

      {/* La salud de la plataforma: la última semana contra la anterior */}
      <section className="bg-card shadow-card mt-5 rounded-3xl p-7">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="font-heading text-xl font-bold">Últimos 7 días</h2>
          <p className="text-muted-foreground text-sm">Comparado con los 7 días anteriores</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {indicadores.map((indicador) => (
              <div key={indicador.label} className="min-w-0">
                {/* Todos con la misma forma: etiqueta y comparación arriba,
                    el valor y abajo de qué sale */}
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <p className="text-sm font-semibold">{indicador.label}</p>
                  <VariationBadge
                    variacion={indicador.variacion}
                    subirEsBueno={indicador.subirEsBueno}
                  />
                  {indicador.antes !== null && (
                    <span
                      title="El mismo dato en los 7 días anteriores"
                      className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-sm font-semibold"
                    >
                      {indicador.antes}
                    </span>
                  )}
                </div>
                <p className="font-heading mt-1 text-3xl font-bold tracking-tight tabular-nums">
                  {indicador.valor}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{indicador.detalle}</p>
              </div>
            ))}
          </div>

          <ReservasPorDia totales={totalesPorDia} desde={inicioDeLaAnterior} />
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Lo que pasa hoy, con el reparto por estado */}
        <section className="bg-card shadow-card min-w-0 rounded-3xl p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <h2 className="font-heading text-xl font-bold">Hoy</h2>
              <p className="mt-1.5 flex items-baseline gap-3">
                <span className="font-heading text-5xl font-bold tracking-tight">
                  {gruposDeHoy.length}
                </span>
                <span className="leading-snug font-semibold">
                  {gruposDeHoy.length === 1 ? 'reserva' : 'reservas'}
                </span>
              </p>
            </div>
            <Link
              href={urlDeReservasGlobales({ desde: hoy, hasta: hoy })}
              className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              Ver las reservas de hoy
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <RepartoDeReservas conteo={reservasDeHoy} />

          <div className="border-border mt-6 border-t pt-5">
            <TurnosPorHora horas={horasDeHoy} horaActual={horaActual} />
          </div>
        </section>

        {/* Quiénes usan la plataforma */}
        <section className="bg-card shadow-card flex min-w-0 flex-col rounded-3xl p-7">
          <h2 className="font-heading mb-3 text-xl font-bold">Comunidad</h2>
          {/* Las filas se reparten el alto, que lo marca la tarjeta de Hoy */}
          <ul className="divide-border flex flex-1 flex-col justify-around divide-y">
            {comunidad.map((fila) => {
              const Icono = fila.icono
              const contenido = (
                <>
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${fila.color}`}
                  >
                    <Icono className="size-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{fila.label}</span>
                    <span className="text-muted-foreground block truncate text-sm">
                      {fila.detalle}
                    </span>
                  </span>
                  <span className="font-heading text-2xl font-bold tabular-nums">
                    {fila.valor.toLocaleString('es-AR')}
                  </span>
                </>
              )

              return (
                <li key={fila.label}>
                  {fila.href === null ? (
                    <div className="flex items-center gap-4 py-3">
                      {contenido}
                      <span className="size-5 shrink-0" />
                    </div>
                  ) : (
                    <Link
                      href={fila.href}
                      className="hover:bg-muted -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors"
                    >
                      {contenido}
                      <ChevronRight className="text-muted-foreground size-5 shrink-0" />
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
