import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Clock, MapPin, Search } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { pendientesVencidas } from '@/lib/bookings'
import { venceLaSena } from '@/lib/estado-reserva'
import { diaCercano, diaEnPalabras, proximoSabado } from '@/lib/fechas'
import { deporteLabels, mesesCortos, nombresCortosDeDias } from '@/lib/labels'
import { diaDeHoy, diaDeReserva, diaSemanaDeReserva } from '@/lib/time'
import { Button } from '@/components/ui/button'
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'
import { EstadoVacio } from '@/components/estado-vacio'
import { CuentaRegresivaSena } from '@/components/cuenta-regresiva-sena'
import { RefreshWhenDepositExpires } from '@/components/refresh-when-deposit-expires'
import { DibujoDeCancha } from '@/components/dibujo-de-cancha'

export default async function JugadorHomePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const desdeHoy = new Date(diaDeHoy())

  // Las cuatro consultas no dependen entre sí: se hacen a la vez (una sola
  // espera a la base en lugar de cuatro seguidas).
  const [proximasReservas, totalProximasReservas, totalReservas, totalComplejos] =
    await Promise.all([
      db.reserva.findMany({
        where: {
          jugadorId: session.user.id,
          estado: { not: 'CANCELADA' },
          NOT: pendientesVencidas(),
          fecha: { gte: desdeHoy },
        },
        include: { cancha: { include: { complejo: true } } },
        orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }],
        take: 3,
      }),
      db.reserva.count({
        where: {
          jugadorId: session.user.id,
          estado: { not: 'CANCELADA' },
          NOT: pendientesVencidas(),
          fecha: { gte: desdeHoy },
        },
      }),
      db.reserva.count({
        where: { jugadorId: session.user.id, NOT: pendientesVencidas() },
      }),
      db.complejo.count({
        where: { activo: true, canchas: { some: { activo: true } } },
      }),
    ])

  // El primero va destacado arriba; los otros dos, como tarjetas debajo.
  const [proximoTurno, ...otrosTurnos] = proximasReservas

  const primerNombre = (session.user.name ?? '').split(' ')[0]
  const hoy = diaDeHoy()

  // La frase de arriba cuenta cuándo es el próximo partido
  let bajada = 'Buscá una cancha libre y reservá tu próximo partido.'
  let cuando: 'hoy' | 'mañana' | null = null
  if (proximoTurno !== undefined) {
    const diaDelTurno = diaDeReserva(proximoTurno.fecha)
    const zona = proximoTurno.cancha.complejo.zona
    cuando = diaCercano(diaDelTurno, hoy)
    if (cuando === 'hoy') {
      bajada = `Hoy te toca jugar en ${zona}.`
    } else if (cuando === 'mañana') {
      bajada = `Mañana te toca jugar en ${zona}.`
    } else {
      bajada = `Tu próximo partido es el ${diaEnPalabras(diaDelTurno).toLowerCase()}.`
    }
  }

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{diaEnPalabras(hoy)}</p>
          <h1 className="font-heading mt-1 text-4xl font-bold tracking-tight">
            ¡Buenas, {primerNombre}!
          </h1>
          <p className="text-muted-foreground mt-1.5">{bajada}</p>
        </div>
        <Button render={<Link href="/jugador/canchas" />}>
          <Search className="size-4" />
          Buscar canchas
        </Button>
      </div>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section>
          {proximoTurno === undefined ? (
            <EstadoVacio
              titulo="No tenés turnos reservados"
              texto="Elegí un complejo y reservá el horario que te sirva."
            >
              <Button render={<Link href="/jugador/canchas" />}>
                <Search className="size-4" />
                Buscar canchas
              </Button>
            </EstadoVacio>
          ) : (
            <>
              {/* Destacado: el próximo partido en grande, sobre el verde de marca */}
              <div className="fondo-cancha text-primary-foreground shadow-card relative overflow-hidden rounded-3xl p-7 sm:p-8">
                {/* Franja con la cancha del deporte, recortada en diagonal contra
                    el borde derecho. Es un detalle: va chica y semitransparente. */}
                <div
                  aria-hidden
                  className="absolute inset-y-0 right-0 hidden w-31 opacity-50 [clip-path:polygon(42%_0,100%_0,100%_100%,0_100%)] [mask-image:linear-gradient(270deg,black_40%,rgb(0_0_0/0.3)_100%)] sm:block"
                >
                  <DibujoDeCancha deporte={proximoTurno.cancha.deporte} />
                </div>
                {/* Línea sobre el borde del recorte, mismos puntos que el clip-path */}
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="text-primary-foreground/40 absolute inset-y-0 right-0 hidden h-full w-31 sm:block"
                >
                  <line
                    x1="42"
                    y1="0"
                    x2="0"
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <div className="relative sm:pr-28">
                  <p className="border-primary-foreground/40 inline-flex h-7 items-center rounded-full border px-3 text-sm font-semibold">
                    Tu próximo partido{cuando !== null && ` · ${cuando}`}
                  </p>
                  <p className="font-heading mt-3.5 text-4xl font-bold tracking-tight">
                    {diaEnPalabras(diaDeReserva(proximoTurno.fecha))}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-lg font-medium">
                    <Clock className="size-4.5 shrink-0" />
                    {proximoTurno.horaInicio} a {proximoTurno.horaFin} hs
                  </p>
                  <p className="mt-4 font-semibold">
                    {proximoTurno.cancha.nombre} · {deporteLabels[proximoTurno.cancha.deporte]}
                  </p>
                  <p className="text-primary-foreground/90 mt-0.5 flex items-center gap-1.5 text-sm">
                    <MapPin className="size-3.5 shrink-0" />
                    {proximoTurno.cancha.complejo.nombre} · {proximoTurno.cancha.complejo.zona}
                  </p>

                  {/* Pendiente de seña: la cuenta regresiva va sobre fondo
                      claro, porque sus colores no se leen sobre el verde */}
                  {proximoTurno.estado === 'PENDIENTE' ? (
                    <div className="bg-background text-foreground mt-5 space-y-3 rounded-2xl p-4">
                      <CuentaRegresivaSena
                        venceEn={venceLaSena(proximoTurno.createdAt).toISOString()}
                      />
                      <RefreshWhenDepositExpires
                        venceEn={venceLaSena(proximoTurno.createdAt).toISOString()}
                      />
                      <Button size="sm" render={<Link href="/jugador/reservas" />}>
                        Pagar seña
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      className="mt-5"
                      render={<Link href="/jugador/reservas" />}
                    >
                      Ver mi reserva
                      <ArrowRight className="size-4" />
                    </Button>
                  )}
                </div>
              </div>

              {otrosTurnos.length > 0 && (
                <>
                  <div className="mt-7 mb-3.5 flex items-baseline justify-between px-1">
                    <h2 className="font-heading text-xl font-bold">Después vienen</h2>
                    <Link
                      href="/jugador/reservas"
                      className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold"
                    >
                      Ver todas
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {otrosTurnos.map((reserva) => {
                      const dia = diaDeReserva(reserva.fecha)
                      // Arriba del número va "Hoy", "Mañana" o el día de la semana
                      const cercano = diaCercano(dia, hoy)
                      let nombreDelDia = nombresCortosDeDias[diaSemanaDeReserva(reserva.fecha)]
                      if (cercano === 'hoy') nombreDelDia = 'Hoy'
                      if (cercano === 'mañana') nombreDelDia = 'Mañana'

                      return (
                        <Link
                          key={reserva.id}
                          href="/jugador/reservas"
                          className="bg-card shadow-card hover:bg-accent relative flex min-h-22 items-center gap-4 overflow-hidden rounded-2xl py-3 pr-5 pl-22 transition-colors"
                        >
                          {/* La cancha del deporte en diagonal, como en la card
                              de cancha pero más angosta */}
                          <div
                            aria-hidden
                            className="absolute inset-y-0 left-0 w-20 opacity-75 [clip-path:polygon(0_0,58%_0,100%_100%,0_100%)] [mask-image:linear-gradient(90deg,black_40%,rgb(0_0_0/0.3)_100%)]"
                          >
                            <DibujoDeCancha deporte={reserva.cancha.deporte} />
                          </div>
                          <svg
                            aria-hidden
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            className="text-primary/50 absolute inset-y-0 left-0 h-full w-20"
                          >
                            <line
                              x1="58"
                              y1="0"
                              x2="100"
                              y2="100"
                              stroke="currentColor"
                              strokeWidth="1"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>

                          {/* El día en grande: es lo primero que se busca en esta lista */}
                          <div className="w-14 shrink-0 text-center">
                            <p className="text-primary text-xs font-bold uppercase">
                              {nombreDelDia}
                            </p>
                            <p className="font-heading text-3xl leading-none font-bold">
                              {Number(dia.slice(8))}
                            </p>
                            <p className="text-muted-foreground mt-0.5 text-xs uppercase">
                              {mesesCortos[Number(dia.slice(5, 7)) - 1]}
                            </p>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                              <span className="font-semibold">
                                {reserva.horaInicio} a {reserva.horaFin} hs
                              </span>
                              <EtiquetaDeporte deporte={reserva.cancha.deporte} />
                            </div>
                            <p className="text-muted-foreground mt-0.5 truncate text-sm">
                              {reserva.cancha.nombre} · {reserva.cancha.complejo.nombre},{' '}
                              {reserva.cancha.complejo.zona}
                            </p>
                          </div>
                          <span className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
                            <ArrowRight className="size-4" />
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {/* Un número protagonista y dos de apoyo, en vez de tres tarjetas iguales */}
          <div className="bg-card shadow-card rounded-3xl p-7">
            <p className="text-muted-foreground text-sm font-semibold">Desde que te sumaste</p>
            <div className="mt-1.5 flex items-baseline gap-3">
              <span className="font-heading text-primary text-7xl font-extrabold tracking-tighter">
                {totalReservas}
              </span>
              <span className="leading-snug font-semibold">
                {totalReservas === 1 ? 'partido reservado' : 'partidos reservados'}
              </span>
            </div>
            <div className="border-border mt-5 flex gap-5 border-t pt-4">
              <div className="min-w-0 flex-1">
                <p className="font-heading text-2xl font-bold">{totalProximasReservas}</p>
                <p className="text-muted-foreground text-sm">
                  {totalProximasReservas === 1 ? 'turno por venir' : 'turnos por venir'}
                </p>
              </div>
              <div className="border-border min-w-0 flex-1 border-l pl-5">
                <p className="font-heading text-2xl font-bold">{totalComplejos}</p>
                <p className="text-muted-foreground text-sm">complejos para elegir</p>
              </div>
            </div>
          </div>

          <div className="bg-clay/12 rounded-3xl px-7 py-6">
            <p className="font-heading text-xl font-bold">¿Sale partido el finde?</p>
            <p className="text-foreground/80 mt-1.5 text-sm">
              Mirá qué canchas quedan libres este sábado.
            </p>
            <Link
              href={`/jugador/canchas?fecha=${proximoSabado(hoy)}`}
              className="text-clay-foreground mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              Ver canchas libres
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
