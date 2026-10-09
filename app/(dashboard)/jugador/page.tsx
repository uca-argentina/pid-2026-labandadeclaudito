import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarClock,
  Clock,
  MapPin,
  Search,
} from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { pendientesVencidas } from '@/lib/bookings'
import { venceLaSena } from '@/lib/estado-reserva'
import { deporteLabels } from '@/lib/labels'
import { diaDeHoy, diaDeReserva, formatearDia } from '@/lib/time'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'
import { FechaDelTurno } from '@/components/fecha-del-turno'
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

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Hola, {session.user.name}</h1>
          <p className="text-muted-foreground mt-2">
            Buscá una cancha libre y reservá tu próximo partido.
          </p>
        </div>
        <Button render={<Link href="/jugador/canchas" />}>
          <Search className="size-4" />
          Buscar canchas
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tus próximos turnos</h2>
            <Link
              href="/jugador/reservas"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
            >
              Ver todas
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {proximoTurno === undefined ? (
            <div className="border-border bg-card rounded-2xl border p-10 text-center">
              <CalendarClock className="text-muted-foreground mx-auto mb-4 size-8" />
              <p className="font-medium">No tenés turnos reservados</p>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Elegí un complejo y reservá el horario que te sirva.
              </p>
              <Button variant="outline" className="mt-5" render={<Link href="/jugador/canchas" />}>
                Buscar canchas
              </Button>
            </div>
          ) : (
            <>
              {/* Destacado: el próximo partido en grande, sobre el verde de marca */}
              <div className="bg-primary text-primary-foreground flex gap-6 rounded-2xl p-6">
                <div className="min-w-0 flex-1">
                  <p className="text-primary-foreground/80 text-sm font-medium">
                    Tu próximo partido
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {formatearDia(diaDeReserva(proximoTurno.fecha))}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-lg">
                    <Clock className="size-4 shrink-0" />
                    {proximoTurno.horaInicio} a {proximoTurno.horaFin} hs
                  </p>
                  <p className="mt-4 font-semibold">
                    {proximoTurno.cancha.nombre} · {deporteLabels[proximoTurno.cancha.deporte]}
                  </p>
                  <p className="text-primary-foreground/80 mt-1 flex items-center gap-1.5 text-sm">
                    <MapPin className="size-3.5 shrink-0" />
                    {proximoTurno.cancha.complejo.nombre} · {proximoTurno.cancha.complejo.zona}
                  </p>

                  {/* Pendiente de seña: la cuenta regresiva va sobre fondo
                      claro, porque sus colores no se leen sobre el verde */}
                  {proximoTurno.estado === 'PENDIENTE' && (
                    <div className="bg-background text-foreground mt-5 space-y-3 rounded-xl p-4">
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
                  )}
                </div>

                <div className="hidden h-40 w-28 shrink-0 overflow-hidden rounded-xl sm:block">
                  <DibujoDeCancha deporte={proximoTurno.cancha.deporte} />
                </div>
              </div>

              {otrosTurnos.length > 0 && (
                <div className="mt-4 space-y-4">
                  {otrosTurnos.map((reserva) => (
                    <div
                      key={reserva.id}
                      className="border-border bg-card flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border p-5"
                    >
                      <FechaDelTurno
                        dia={diaDeReserva(reserva.fecha)}
                        horaInicio={reserva.horaInicio}
                        horaFin={reserva.horaFin}
                      />
                      <div className="border-border hidden h-10 border-l sm:block" />
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold">{reserva.cancha.nombre}</span>
                          <EtiquetaDeporte deporte={reserva.cancha.deporte} />
                        </div>
                        <p className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-sm">
                          <MapPin className="size-3.5 shrink-0" />
                          {reserva.cancha.complejo.nombre} · {reserva.cancha.complejo.zona}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {/* En celular y tablet, las tres en fila; al costado, apiladas */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard
              icon={CalendarClock}
              label="Próximos turnos"
              value={totalProximasReservas}
              detalle="Reservas de hoy en adelante"
            />
            <StatCard
              icon={CalendarCheck}
              label="Reservas totales"
              value={totalReservas}
              detalle="Desde que te registraste"
            />
            <StatCard
              icon={Building2}
              label="Complejos"
              value={totalComplejos}
              detalle="Disponibles para reservar"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
