import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarCheck, Clock, MapPin, Wallet } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { deporteLabels } from '@/lib/labels'
import { montoDelHistorial } from '@/lib/historial'
import { estadoDeReserva } from '@/lib/estado-reserva'
import { diaDeReserva, formatearDia, momentoActual, turnoYaPaso } from '@/lib/time'
import { BookingStatusBadge } from '@/components/booking-status-badge'
import { CancelBookingButton } from '@/components/cancel-booking-button'
import { PayDepositButton } from '@/components/pay-deposit-button'

async function getReservas(jugadorId: string) {
  return db.reserva.findMany({
    where: { jugadorId },
    include: { cancha: { include: { complejo: true } }, pago: true },
    orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
  })
}

type Reserva = Awaited<ReturnType<typeof getReservas>>[number]

const tonos = {
  normal: 'text-primary',
  exito: 'text-green-600',
  peligro: 'text-destructive',
}

export default async function MisReservasPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const reservas = await getReservas(session.user.id)
  const ahora = momentoActual()

  // Próximas: las que todavía se van a jugar (la que está en curso también),
  // de la más cercana a la más lejana. Historial: finalizadas y canceladas, de
  // la más reciente a la más vieja.
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
  const historial = reservas.filter((r) => !esProxima(r))

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Mis reservas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tus próximos turnos y todo lo que reservaste antes.
        </p>
      </div>

      {reservas.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-8 text-center">
          <CalendarCheck className="text-muted-foreground mx-auto mb-3 size-8" />
          <p className="text-muted-foreground text-sm">Todavía no reservaste ninguna cancha.</p>
          <Link
            href="/jugador/canchas"
            className="text-primary mt-2 inline-block text-sm font-medium"
          >
            Buscar canchas
          </Link>
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
            <section className="space-y-4">
              <h2 className="text-muted-foreground text-sm font-medium">Historial</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {historial.map((reserva) => (
                  <TarjetaReserva key={reserva.id} reserva={reserva} ahora={ahora} />
                ))}
              </div>
            </section>
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
    'JUGADOR',
  )
  // Mismo cálculo que hace el endpoint de la seña: es solo para mostrar el
  // monto en el botón, el que se cobra lo calcula el server.
  const porcentajeSena =
    reserva.cancha.porcentajeSena ?? reserva.cancha.complejo.porcentajeSenaDefault
  const montoSena = ((Number(reserva.precioTurno) * porcentajeSena) / 100).toString()

  const muestraPagar = reserva.estado === 'PENDIENTE' && !yaPaso
  const muestraCancelar = !cancelada && !yaPaso
  const mostrarFooter = monto !== null || muestraPagar || muestraCancelar

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

      <div className="text-muted-foreground mt-2 space-y-1.5 text-sm">
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          {reserva.cancha.complejo.nombre} · {reserva.cancha.complejo.direccion}
        </p>
        <p className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0" />
          {formatearDia(dia)} · {reserva.horaInicio} a {reserva.horaFin} hs
        </p>
      </div>

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
          {(muestraPagar || muestraCancelar) && (
            <div className="flex items-center gap-2">
              {muestraPagar && <PayDepositButton bookingId={reserva.id} montoSena={montoSena} />}
              {muestraCancelar && <CancelBookingButton bookingId={reserva.id} />}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
