import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, ChevronRight, CircleCheck, Scale } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { contarPorGrupo, grupoDelEstado, urlDeReservasGlobales } from '@/lib/admin-bookings'
import type { GrupoDeEstado } from '@/lib/admin-bookings'
import { pendientesVencidas } from '@/lib/bookings'
import { estadoDeReserva } from '@/lib/estado-reserva'
import { diaEnPalabras, haceCuanto, saludoSegunHora } from '@/lib/fechas'
import { homePorRol } from '@/lib/home-por-rol'
import { diaDeHoy, diaDeReserva, momentoActual } from '@/lib/time'
import { RepartoDeReservas } from '@/components/reparto-de-reservas'

export default async function AdminHomePage() {
  // El proxy ya filtra por rol, pero la página lo vuelve a chequear
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.rol !== 'ADMIN') redirect(homePorRol(session.user.rol))

  const hoy = diaDeHoy()

  // Las cuatro consultas no dependen entre sí: se hacen a la vez
  const [disputasAbiertas, disputaMasVieja, cuentasSuspendidas, reservasDeHoy] = await Promise.all([
    db.disputa.count({ where: { estado: 'ABIERTA' } }),
    db.disputa.findFirst({
      where: { estado: 'ABIERTA' },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    }),
    db.usuario.count({ where: { activo: false } }),
    // Solo lo que hace falta para saber el estado (igual que /admin/reservas)
    db.reserva.findMany({
      where: { fecha: new Date(hoy), NOT: pendientesVencidas() },
      select: { estado: true, asistio: true, fecha: true, horaInicio: true, horaFin: true },
    }),
  ])

  // En curso, Finalizada y No se presentó salen del reloj: se calculan acá
  const ahora = momentoActual()
  const grupos: GrupoDeEstado[] = []
  for (const reserva of reservasDeHoy) {
    const estado = estadoDeReserva(
      {
        estado: reserva.estado,
        asistio: reserva.asistio,
        dia: diaDeReserva(reserva.fecha),
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
      },
      ahora,
    )
    grupos.push(grupoDelEstado(estado))
  }
  const reservasPorEstado = contarPorGrupo(grupos)

  // Por ahora solo disputas; los complejos por aprobar se suman con SCRUM-57
  const totalParaResolver = disputasAbiertas

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

      {/* La protagonista: lo que espera una decisión del admin. Una banda a
          todo el ancho: el total a la izquierda y cada cola a la derecha */}
      {totalParaResolver === 0 ? (
        <section className="fondo-cancha tema-todos text-acento-foreground shadow-card flex items-center gap-5 rounded-3xl p-7 sm:p-8">
          <CircleCheck className="size-11 shrink-0" />
          <div>
            <p className="font-heading text-3xl font-bold tracking-tight">Está todo al día</p>
            <p className="text-acento-foreground/90 mt-1">
              No hay disputas esperando una decisión. Cuando un jugador abra una, va a aparecer acá.
            </p>
          </div>
        </section>
      ) : (
        <section className="bg-card shadow-card grid grid-cols-1 gap-5 rounded-3xl p-7 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
          <div>
            <p className="text-muted-foreground text-sm font-semibold">Para resolver</p>
            <div className="mt-1.5 flex items-baseline gap-3">
              <span className="font-heading text-primary text-7xl font-extrabold tracking-tighter">
                {totalParaResolver}
              </span>
              <span className="leading-snug font-semibold">
                {totalParaResolver === 1 ? 'pendiente' : 'pendientes'}
              </span>
            </div>
          </div>

          <div className="border-border flex flex-col justify-center border-t pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <Link
              href="/admin/disputas"
              className="hover:bg-muted -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors"
            >
              <span className="bg-clay/12 text-clay-foreground flex size-11 shrink-0 items-center justify-center rounded-xl">
                <Scale className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">Disputas abiertas</span>
                <span className="text-muted-foreground block text-sm">
                  La más vieja, {antiguedadDeLaDisputa}
                </span>
              </span>
              <span className="font-heading text-2xl font-bold tabular-nums">
                {disputasAbiertas}
              </span>
              <ChevronRight className="text-muted-foreground size-5 shrink-0" />
            </Link>
          </div>
        </section>
      )}

      {/* El pulso de la plataforma */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="bg-card shadow-card min-w-0 rounded-3xl p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <p className="text-muted-foreground text-sm font-semibold">Reservas de hoy</p>
              <p className="mt-1.5 flex items-baseline gap-3">
                <span className="font-heading text-5xl font-bold tracking-tight">
                  {reservasDeHoy.length}
                </span>
                <span className="leading-snug font-semibold">
                  {reservasDeHoy.length === 1 ? 'reserva' : 'reservas'}
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
          <RepartoDeReservas conteo={reservasPorEstado} />
        </section>

        <section className="bg-clay/12 flex flex-col rounded-3xl px-7 py-6">
          <p className="flex items-baseline gap-2.5">
            <span className="font-heading text-3xl font-bold">{cuentasSuspendidas}</span>
            <span className="font-semibold">
              {cuentasSuspendidas === 1 ? 'cuenta suspendida' : 'cuentas suspendidas'}
            </span>
          </p>
          <p className="text-foreground/80 mt-1.5 text-sm">
            No pueden iniciar sesión hasta que las reactives.
          </p>
          <Link
            href="/admin/usuarios?filtro=suspendidas"
            className="text-clay-foreground mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold"
          >
            Ver cuentas suspendidas
            <ArrowRight className="size-3.5" />
          </Link>
        </section>
      </div>
    </div>
  )
}
