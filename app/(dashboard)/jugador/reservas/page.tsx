import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarCheck, Clock, Hourglass, MapPin, Wallet } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import type { Prisma } from '@/lib/generated/prisma/client'
import { dondeHistorial, dondeProximas } from '@/lib/bookings'
import { deporteLabels, formatPrecio } from '@/lib/labels'
import { montoDelHistorial } from '@/lib/historial'
import { venceLaSena } from '@/lib/estado-reserva'
import { calcularPagina } from '@/lib/paginacion'
import { diaDeReserva, formatearDia, momentoActual, refundsDeposit, turnoYaPaso } from '@/lib/time'
import { BookingStatusBadge } from '@/components/booking-status-badge'
import { CancelBookingButton } from '@/components/cancel-booking-button'
import { Paginacion } from '@/components/paginacion'
import { PayDepositButton } from '@/components/pay-deposit-button'
import { RefreshWhenDepositExpires } from '@/components/refresh-when-deposit-expires'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Próximas se muestran como tarjetas (tienen acciones: pagar, cancelar).
// Historial y canceladas, como tabla: son solo para consultar.
const TARJETAS_POR_PAGINA = 12
const FILAS_POR_PAGINA = 20

const vistas = {
  proximas: 'Próximas',
  historial: 'Historial',
  canceladas: 'Canceladas',
}
type Vista = keyof typeof vistas

async function getReservas(
  where: Prisma.ReservaWhereInput,
  orden: 'asc' | 'desc',
  skip: number,
  take: number,
) {
  return db.reserva.findMany({
    where,
    include: { cancha: { include: { complejo: true } }, pago: true },
    orderBy: [{ fecha: orden }, { horaInicio: orden }],
    skip,
    take,
  })
}

type Reserva = Awaited<ReturnType<typeof getReservas>>[number]

const tonos = {
  normal: 'text-primary',
  exito: 'text-green-600',
  peligro: 'text-destructive',
}

export default async function MisReservasPage({ searchParams }: PageProps<'/jugador/reservas'>) {
  const session = await auth()
  if (!session) redirect('/login')
  const jugadorId = session.user.id

  // ?vista=historial|canceladas elige la pestaña (sin vista = próximas)
  // ?pagina=2 elige la página dentro de esa pestaña
  const { vista: vistaPedida, pagina } = await searchParams
  let vista: Vista = 'proximas'
  if (vistaPedida === 'historial' || vistaPedida === 'canceladas') vista = vistaPedida

  // Qué es "próxima" o "historial" lo decide la base (ver dondeProximas),
  // así cuenta y pagina sin traer todas las reservas.
  const ahora = momentoActual()
  const dondePorVista: Record<Vista, Prisma.ReservaWhereInput> = {
    proximas: { jugadorId, ...dondeProximas(ahora) },
    historial: { jugadorId, ...dondeHistorial(ahora) },
    canceladas: { jugadorId, estado: 'CANCELADA' },
  }

  const [totalProximas, totalHistorial, totalCanceladas] = await Promise.all([
    db.reserva.count({ where: dondePorVista.proximas }),
    db.reserva.count({ where: dondePorVista.historial }),
    db.reserva.count({ where: dondePorVista.canceladas }),
  ])
  const totales = {
    proximas: totalProximas,
    historial: totalHistorial,
    canceladas: totalCanceladas,
  }

  const porPagina = vista === 'proximas' ? TARJETAS_POR_PAGINA : FILAS_POR_PAGINA
  const { paginaActual, totalPaginas, skip } = calcularPagina(pagina, totales[vista], porPagina)

  // Próximas: de la más cercana a la más lejana.
  // Historial y canceladas: de la más reciente a la más vieja.
  const reservas = await getReservas(
    dondePorVista[vista],
    vista === 'proximas' ? 'asc' : 'desc',
    skip,
    porPagina,
  )

  function urlDe(vistaDelLink: Vista, paginaDelLink: number) {
    const params = new URLSearchParams()
    if (vistaDelLink !== 'proximas') params.set('vista', vistaDelLink)
    if (paginaDelLink > 1) params.set('pagina', String(paginaDelLink))
    return `/jugador/reservas?${params.toString()}`
  }

  const paginacion = (
    <Paginacion
      paginaActual={paginaActual}
      totalPaginas={totalPaginas}
      desde={skip + 1}
      hasta={skip + reservas.length}
      total={totales[vista]}
      urlAnterior={urlDe(vista, paginaActual - 1)}
      urlSiguiente={urlDe(vista, paginaActual + 1)}
    />
  )

  const noReservoNunca = totalProximas + totalHistorial + totalCanceladas === 0

  return (
    <main className="max-w-5xl px-6 pt-6 pb-12 md:pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Mis reservas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tus próximos turnos y todo lo que reservaste antes.
        </p>
      </div>

      {noReservoNunca ? (
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
        <>
          {/* Pestañas: cada una es un link, la elegida va rellena */}
          <div className="mb-6 flex flex-wrap gap-2">
            <PestaniaDeVista href={urlDe('proximas', 1)} elegida={vista === 'proximas'}>
              {vistas.proximas} ({totales.proximas})
            </PestaniaDeVista>
            <PestaniaDeVista href={urlDe('historial', 1)} elegida={vista === 'historial'}>
              {vistas.historial} ({totales.historial})
            </PestaniaDeVista>
            <PestaniaDeVista href={urlDe('canceladas', 1)} elegida={vista === 'canceladas'}>
              {vistas.canceladas} ({totales.canceladas})
            </PestaniaDeVista>
          </div>

          {reservas.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {vista === 'proximas' && 'No tenés turnos próximos.'}
              {vista === 'historial' && 'Todavía no jugaste ningún turno.'}
              {vista === 'canceladas' && 'No tenés reservas canceladas.'}
            </p>
          )}

          {reservas.length > 0 && vista === 'proximas' && (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {reservas.map((reserva) => (
                  <TarjetaReserva key={reserva.id} reserva={reserva} ahora={ahora} />
                ))}
              </div>
              {/* Con una sola página de tarjetas no hace falta el pie */}
              {totalPaginas > 1 && (
                <div className="border-border bg-card mt-4 overflow-hidden rounded-2xl border">
                  {paginacion}
                </div>
              )}
            </>
          )}

          {reservas.length > 0 && vista !== 'proximas' && (
            <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Turno</TableHead>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden pr-4 text-right sm:table-cell">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservas.map((reserva) => (
                    <FilaReserva key={reserva.id} reserva={reserva} ahora={ahora} />
                  ))}
                </TableBody>
              </Table>
              {paginacion}
            </div>
          )}
        </>
      )}
    </main>
  )
}

function PestaniaDeVista({
  href,
  elegida,
  children,
}: {
  href: string
  elegida: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={
        elegida
          ? 'bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm'
          : 'border-border hover:bg-muted rounded-full border px-3 py-1 text-sm'
      }
    >
      {children}
    </Link>
  )
}

// Una fila de la tabla de historial o canceladas: solo para consultar
function FilaReserva({
  reserva,
  ahora,
}: {
  reserva: Reserva
  ahora: { dia: string; hora: string }
}) {
  const dia = diaDeReserva(reserva.fecha)
  const monto = montoDelHistorial(
    {
      estado: reserva.estado,
      asistio: reserva.asistio,
      precioTurno: reserva.precioTurno.toString(),
      pago: reserva.pago && { ...reserva.pago, monto: reserva.pago.monto.toString() },
    },
    turnoYaPaso(dia, reserva.horaInicio),
    'JUGADOR',
  )

  return (
    <TableRow>
      <TableCell className="pl-4">
        <p className="font-medium">{formatearDia(dia)}</p>
        <p className="text-muted-foreground text-xs">
          {reserva.horaInicio} a {reserva.horaFin} hs
        </p>
      </TableCell>
      <TableCell>
        <p className="font-medium">
          {reserva.cancha.nombre}{' '}
          <span className="text-muted-foreground text-xs font-normal">
            · {deporteLabels[reserva.cancha.deporte]}
          </span>
        </p>
        <p className="text-muted-foreground text-xs">{reserva.cancha.complejo.nombre}</p>
      </TableCell>
      <TableCell>
        <BookingStatusBadge
          estado={reserva.estado}
          asistio={reserva.asistio}
          dia={dia}
          horaInicio={reserva.horaInicio}
          horaFin={reserva.horaFin}
          ahoraInicial={ahora}
        />
      </TableCell>
      <TableCell className="hidden pr-4 text-right sm:table-cell">
        {monto && (
          <>
            <p className={`font-semibold ${tonos[monto.tono]}`}>{monto.monto}</p>
            <p className="text-muted-foreground text-xs">{monto.etiqueta}</p>
          </>
        )}
      </TableCell>
    </TableRow>
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
  const horaLimiteSena = momentoActual(venceLaSena(reserva.createdAt)).hora

  // Aviso para el diálogo de cancelar: mismo cálculo que hace el endpoint.
  let avisoSena: string | null = null
  if (reserva.pago && muestraCancelar) {
    const horasAlPagar = reserva.pago.cancellationHours
    const horasActuales = reserva.cancha.complejo.cancellationHours
    const montoPagado = formatPrecio(reserva.pago.monto.toString())
    if (refundsDeposit(dia, reserva.horaInicio, horasAlPagar, horasActuales)) {
      avisoSena = `Se te devuelve la seña de ${montoPagado}.`
    } else {
      const horas = Math.min(horasAlPagar, horasActuales)
      avisoSena = `Faltan menos de ${horas} hs para el turno: la seña de ${montoPagado} no se devuelve.`
    }
  }
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

      <div className="text-muted-foreground mt-2 mb-4 space-y-1.5 text-sm">
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          {reserva.cancha.complejo.nombre} · {reserva.cancha.complejo.direccion}
        </p>
        <p className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0" />
          {formatearDia(dia)} · {reserva.horaInicio} a {reserva.horaFin} hs
        </p>
        {muestraPagar && (
          <p className="text-foreground flex items-center gap-1.5 font-medium">
            <Hourglass className="size-3.5 shrink-0" />
            Pagá la seña antes de las {horaLimiteSena} hs o el turno se libera
            <RefreshWhenDepositExpires venceEn={venceLaSena(reserva.createdAt).toISOString()} />
          </p>
        )}
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
            <div className="flex flex-wrap items-center gap-2">
              {muestraPagar && <PayDepositButton bookingId={reserva.id} montoSena={montoSena} />}
              {muestraCancelar && (
                <CancelBookingButton bookingId={reserva.id} avisoSena={avisoSena} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
