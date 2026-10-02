import { redirect } from 'next/navigation'
import { CalendarClock, Clock, MapPin, User, Wallet } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { pendientesVencidas } from '@/lib/bookings'
import { deporteLabels } from '@/lib/labels'
import { montoDelHistorial } from '@/lib/historial'
import { estadoDeReserva, venceLaSena } from '@/lib/estado-reserva'
import { diaDeReserva, formatearDia, momentoActual, turnoYaPaso } from '@/lib/time'
import { BookingStatusBadge } from '@/components/booking-status-badge'
import { AttendanceButtons } from '@/components/attendance-buttons'
import { CollapsibleSection } from '@/components/collapsible-section'
import { RefreshWhenDepositExpires } from '@/components/refresh-when-deposit-expires'

async function getReservas(duenioId: string) {
  return db.reserva.findMany({
    where: { cancha: { complejo: { duenioId } }, NOT: pendientesVencidas() },
    include: { cancha: { include: { complejo: true } }, jugador: true, pago: true },
    orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
  })
}

type Reserva = Awaited<ReturnType<typeof getReservas>>[number]

const tonos = {
  normal: 'text-primary',
  exito: 'text-green-600',
  peligro: 'text-destructive',
}

export default async function ReservasDelDuenioPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const reservas = await getReservas(session.user.id)
  const ahora = momentoActual()

  // Próximas: las que todavía se van a jugar (la que está en curso también),
  // de la más cercana a la más lejana. Historial: las que ya pasaron.
  // Canceladas: aparte, con o sin seña devuelta. Estas dos, de la más
  // reciente a la más vieja.
  const esProxima = (r: Reserva) => {
    const dia = diaDeReserva(r.fecha)
    const visible = estadoDeReserva(
      { estado: r.estado, asistio: r.asistio, dia, horaInicio: r.horaInicio, horaFin: r.horaFin },
      ahora,
    )
    if (visible === 'CONFIRMADA' || visible === 'EN_CURSO') return true
    // Una pendiente que nunca se pagó deja de ser próxima cuando empieza el turno.
    return visible === 'PENDIENTE' && !turnoYaPaso(dia, r.horaInicio)
  }
  const proximas = reservas.filter(esProxima).reverse()
  const historial = reservas.filter((r) => !esProxima(r) && r.estado !== 'CANCELADA')
  const canceladas = reservas.filter((r) => r.estado === 'CANCELADA')

  return (
    <main className="mx-auto max-w-5xl px-6 pt-6 pb-12 md:pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Reservas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Los próximos turnos en tus canchas y todo lo que se reservó antes.
        </p>
      </div>

      {reservas.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-8 text-center">
          <CalendarClock className="text-muted-foreground mx-auto mb-3 size-8" />
          <p className="font-medium">Todavía no hay turnos reservados</p>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Cuando un jugador reserve una de tus canchas, va a aparecer acá.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {proximas.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-muted-foreground text-sm font-medium">Próximos</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {proximas.map((reserva) => (
                  <TarjetaReserva key={reserva.id} reserva={reserva} ahora={ahora} />
                ))}
              </div>
            </section>
          )}
          {historial.length > 0 && (
            <CollapsibleSection title="Historial" /* count={historial.length} */>
              {historial.map((reserva) => (
                <TarjetaReserva key={reserva.id} reserva={reserva} ahora={ahora} />
              ))}
            </CollapsibleSection>
          )}
          {canceladas.length > 0 && (
            <CollapsibleSection title="Canceladas" /* count={canceladas.length} */>
              {canceladas.map((reserva) => (
                <TarjetaReserva key={reserva.id} reserva={reserva} ahora={ahora} />
              ))}
            </CollapsibleSection>
          )}
        </div>
      )}
    </main>
  )
}

function TarjetaReserva({
  reserva,
  ahora,
}: {
  reserva: Reserva
  ahora: { dia: string; hora: string }
}) {
  const dia = diaDeReserva(reserva.fecha)
  const cancelada = reserva.estado === 'CANCELADA'
  const yaPaso = turnoYaPaso(dia, reserva.horaInicio)
  const monto = montoDelHistorial(
    {
      estado: reserva.estado,
      asistio: reserva.asistio,
      precioTurno: reserva.precioTurno.toString(),
      pago: reserva.pago && { ...reserva.pago, monto: reserva.pago.monto.toString() },
    },
    yaPaso,
    'DUENIO',
  )

  // El dueño marca la asistencia recién cuando el turno terminó.
  const visible = estadoDeReserva(
    {
      estado: reserva.estado,
      asistio: reserva.asistio,
      dia,
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
    },
    ahora,
  )
  const seMarcaAsistencia =
    visible === 'FINALIZADA' || visible === 'ASISTIO' || visible === 'NO_SHOW'
  const mostrarFooter = monto !== null || seMarcaAsistencia

  return (
    <div
      className={
        cancelada
          ? 'border-border bg-card flex h-full flex-col rounded-2xl border p-5 opacity-60'
          : 'border-border bg-card flex h-full flex-col rounded-2xl border p-5'
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg font-bold">{reserva.cancha.nombre}</span>
        <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs">
          {deporteLabels[reserva.cancha.deporte]}
        </span>
        <BookingStatusBadge
          estado={reserva.estado}
          asistio={reserva.asistio}
          dia={dia}
          horaInicio={reserva.horaInicio}
          horaFin={reserva.horaFin}
          ahoraInicial={ahora}
        />
      </div>

      <div className="text-muted-foreground mt-2 mb-4 space-y-1.5 text-sm">
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          {reserva.cancha.complejo.nombre}
        </p>
        <p className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0" />
          {formatearDia(dia)} · {reserva.horaInicio} a {reserva.horaFin} hs
        </p>
        <p className="flex items-center gap-1.5">
          <User className="size-3.5 shrink-0" />
          {reserva.jugador.nombre} · {reserva.jugador.email}
          {reserva.jugador.telefono ? ` · ${reserva.jugador.telefono}` : ''}
        </p>
      </div>
      {reserva.estado === 'PENDIENTE' && (
        <RefreshWhenDepositExpires venceEn={venceLaSena(reserva.createdAt).toISOString()} />
      )}

      {/* Footer con borde arriba, separado del cuerpo: precio a la izquierda,
          acciones a la derecha. Evita que el precio quede flotando en un
          lugar distinto según cuánto texto tenga el cuerpo de la tarjeta. */}
      {mostrarFooter && (
        <div className="border-border mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div>
            {monto && (
              <>
                <div className="text-muted-foreground text-xs">{monto.etiqueta}</div>
                <div className={`flex items-center gap-1.5 text-lg font-bold ${tonos[monto.tono]}`}>
                  <Wallet className="size-4 shrink-0" />
                  {monto.monto}
                </div>
                {monto.detalle && (
                  <div className="text-muted-foreground text-xs">{monto.detalle}</div>
                )}
              </>
            )}
          </div>
          {seMarcaAsistencia && (
            <AttendanceButtons bookingId={reserva.id} asistio={reserva.asistio} />
          )}
        </div>
      )}
    </div>
  )
}
