import { redirect } from 'next/navigation'
import {
  CalendarDays,
  CircleDot,
  Clock,
  LandPlot,
  Mail,
  Phone,
  User,
  UserCheck,
  Wallet,
} from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import type { Prisma } from '@/lib/generated/prisma/client'
import { dondeHistorial, dondeProximas } from '@/lib/bookings'
import { montoDelHistorial } from '@/lib/historial'
import { estadoDeReserva, venceLaSena } from '@/lib/estado-reserva'
import { calcularPagina } from '@/lib/paginacion'
import { iniciales } from '@/lib/iniciales'
import { diaEnPalabras } from '@/lib/fechas'
import { diaDeReserva, momentoActual, turnoYaPaso } from '@/lib/time'
import { BookingStatusBadge } from '@/components/booking-status-badge'
import { AttendanceButtons } from '@/components/attendance-buttons'
import { CuentaRegresivaSena } from '@/components/cuenta-regresiva-sena'
import { CeldaCancha, CeldaMonto } from '@/components/celdas-reserva'
import { EstadoVacio } from '@/components/estado-vacio'
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'
import { FranjaDeCancha } from '@/components/franja-de-cancha'
import { FechaDelTurno } from '@/components/fecha-del-turno'
import { TituloConIcono } from '@/components/titulo-con-icono'
import { Paginacion } from '@/components/paginacion'
import {
  leerVista,
  PestaniasDeReservas,
  urlDeReservas,
  type VistaDeReservas,
} from '@/components/pestanias-reservas'
import { RefreshWhenDepositExpires } from '@/components/refresh-when-deposit-expires'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Próximas se muestran como tarjetas, historial y canceladas como tabla.
const TARJETAS_POR_PAGINA = 12
const FILAS_POR_PAGINA = 20

async function getReservas(
  where: Prisma.ReservaWhereInput,
  orden: 'asc' | 'desc',
  skip: number,
  take: number,
) {
  return db.reserva.findMany({
    where,
    include: { cancha: { include: { complejo: true } }, jugador: true, pago: true },
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

export default async function ReservasDelDuenioPage({
  searchParams,
}: PageProps<'/dueno/reservas'>) {
  const session = await auth()
  if (!session) redirect('/login')

  // ?vista=historial|canceladas elige la pestaña, ?pagina=2 la página
  const { vista: vistaPedida, pagina } = await searchParams
  const vista = leerVista(vistaPedida)

  // Las reservas de todas las canchas de sus complejos. Qué es "próxima" o
  // "historial" lo decide la base (ver dondeProximas).
  const deSusCanchas = { cancha: { complejo: { duenioId: session.user.id } } }
  const ahora = momentoActual()
  const dondePorVista: Record<VistaDeReservas, Prisma.ReservaWhereInput> = {
    proximas: { ...deSusCanchas, ...dondeProximas(ahora) },
    historial: { ...deSusCanchas, ...dondeHistorial(ahora) },
    canceladas: { ...deSusCanchas, estado: 'CANCELADA' },
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

  const paginacion = (
    <Paginacion
      paginaActual={paginaActual}
      totalPaginas={totalPaginas}
      desde={skip + 1}
      hasta={skip + reservas.length}
      total={totales[vista]}
      urlAnterior={urlDeReservas('/dueno/reservas', vista, paginaActual - 1)}
      urlSiguiente={urlDeReservas('/dueno/reservas', vista, paginaActual + 1)}
    />
  )

  const nuncaReservaron = totalProximas + totalHistorial + totalCanceladas === 0

  return (
    <main>
      <div className="mb-6">
        <h1 className="font-heading text-4xl font-bold tracking-tight">Reservas</h1>
        <p className="text-muted-foreground mt-1.5">
          {totalProximas === 0 &&
            'Los próximos turnos en tus canchas y todo lo que se reservó antes.'}
          {totalProximas === 1 && '1 turno por jugarse en tus canchas.'}
          {totalProximas > 1 && `${totalProximas} turnos por jugarse en tus canchas.`}
        </p>
      </div>

      {nuncaReservaron ? (
        <EstadoVacio
          titulo="Todavía no hay turnos reservados"
          texto="Cuando un jugador reserve una de tus canchas, va a aparecer acá."
        />
      ) : (
        <>
          <PestaniasDeReservas ruta="/dueno/reservas" vista={vista} totales={totales} />

          {reservas.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {vista === 'proximas' && 'No hay turnos próximos en tus canchas.'}
              {vista === 'historial' && 'Todavía no se jugó ningún turno en tus canchas.'}
              {vista === 'canceladas' && 'No hay reservas canceladas.'}
            </p>
          )}

          {reservas.length > 0 && vista === 'proximas' && (
            <>
              {/* Tarjetas de ancho acotado: no se estiran para llenar la fila */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,19rem))] gap-5">
                {reservas.map((reserva) => (
                  <TarjetaReserva key={reserva.id} reserva={reserva} ahora={ahora} />
                ))}
              </div>
              {/* Con una sola página de tarjetas no hace falta el pie */}
              {totalPaginas > 1 && (
                <div className="bg-card shadow-card mt-4 overflow-hidden rounded-2xl">
                  {paginacion}
                </div>
              )}
            </>
          )}

          {reservas.length > 0 && vista !== 'proximas' && (
            <div className="bg-card shadow-card overflow-hidden rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">
                      <TituloConIcono icono={CalendarDays}>Turno</TituloConIcono>
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      <TituloConIcono icono={LandPlot}>Cancha</TituloConIcono>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <TituloConIcono icono={User}>Jugador</TituloConIcono>
                    </TableHead>
                    <TableHead className={vista === 'historial' ? 'hidden sm:table-cell' : ''}>
                      <TituloConIcono icono={CircleDot}>Estado</TituloConIcono>
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      <TituloConIcono icono={Wallet}>Monto</TituloConIcono>
                    </TableHead>
                    {vista === 'historial' && (
                      <TableHead className="pr-4 text-right whitespace-normal">
                        <TituloConIcono icono={UserCheck}>¿Se presentó?</TituloConIcono>
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservas.map((reserva) => (
                    <FilaReserva
                      key={reserva.id}
                      reserva={reserva}
                      ahora={ahora}
                      conAsistencia={vista === 'historial'}
                    />
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

// Una fila de la tabla de historial o canceladas. En el historial lleva los
// botones de asistencia: el dueño la marca recién cuando el turno terminó.
function FilaReserva({
  reserva,
  ahora,
  conAsistencia,
}: {
  reserva: Reserva
  ahora: { dia: string; hora: string }
  conAsistencia: boolean
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
    'DUENIO',
  )
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

  return (
    <TableRow>
      <TableCell className="pl-4">
        <FechaDelTurno dia={dia} horaInicio={reserva.horaInicio} horaFin={reserva.horaFin} />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <CeldaCancha
          nombre={reserva.cancha.nombre}
          deporte={reserva.cancha.deporte}
          complejo={reserva.cancha.complejo.nombre}
        />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/15 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {iniciales(reserva.jugador.nombre)}
          </div>
          <div>
            <p className="font-medium">{reserva.jugador.nombre}</p>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <Phone className="size-3" />
              {reserva.jugador.telefono ?? reserva.jugador.email}
            </p>
          </div>
        </div>
      </TableCell>
      {/* En el historial, en celular no entra: los botones de asistencia ya
          muestran si vino (verde) o no (rojo) */}
      <TableCell className={conAsistencia ? 'hidden sm:table-cell' : ''}>
        <BookingStatusBadge
          estado={reserva.estado}
          asistio={reserva.asistio}
          dia={dia}
          horaInicio={reserva.horaInicio}
          horaFin={reserva.horaFin}
          ahoraInicial={ahora}
        />
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        <CeldaMonto monto={monto} />
      </TableCell>
      {conAsistencia && (
        <TableCell className="pr-4 text-right">
          {seMarcaAsistencia && (
            <AttendanceButtons bookingId={reserva.id} asistio={reserva.asistio} />
          )}
        </TableCell>
      )}
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
    'DUENIO',
  )

  const esperaLaSena = reserva.estado === 'PENDIENTE'
  const venceSena = venceLaSena(reserva.createdAt).toISOString()

  return (
    <div
      className={
        cancelada
          ? 'bg-card shadow-card flex h-full flex-col overflow-hidden rounded-2xl opacity-60'
          : 'bg-card shadow-card flex h-full flex-col overflow-hidden rounded-2xl'
      }
    >
      <FranjaDeCancha deporte={reserva.cancha.deporte} />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <BookingStatusBadge
            estado={reserva.estado}
            asistio={reserva.asistio}
            dia={dia}
            horaInicio={reserva.horaInicio}
            horaFin={reserva.horaFin}
            ahoraInicial={ahora}
          />
          <EtiquetaDeporte deporte={reserva.cancha.deporte} />
        </div>

        <p className="font-heading mt-2 text-lg font-bold">{diaEnPalabras(dia)}</p>
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <Clock className="size-3.5 shrink-0" />
          {reserva.horaInicio} a {reserva.horaFin} hs
        </p>
        <p className="text-muted-foreground mt-2 truncate text-sm">
          <span className="text-foreground font-semibold">{reserva.cancha.nombre}</span> ·{' '}
          {reserva.cancha.complejo.nombre}
        </p>

        {/* Quién reservó: nombre arriba, y el contacto cada uno en su renglón */}
        <div className="bg-muted/60 mt-3 flex items-center gap-2.5 rounded-xl px-2.5 py-2">
          <div className="bg-primary/15 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {iniciales(reserva.jugador.nombre)}
          </div>
          <div className="min-w-0 text-sm">
            <p className="truncate font-semibold">{reserva.jugador.nombre}</p>
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Mail className="size-3 shrink-0" />
              <span className="truncate">{reserva.jugador.email}</span>
            </p>
            {reserva.jugador.telefono && (
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Phone className="size-3 shrink-0" />
                {reserva.jugador.telefono}
              </p>
            )}
          </div>
        </div>

        {/* De acá para abajo todas las tarjetas tienen lo mismo a la misma
            altura, esté o no pagada la seña: un renglón con su barra y el
            monto. */}
        <div className="mt-auto pt-3.5">
          {esperaLaSena ? (
            // El dueño ve el mismo reloj que el jugador: cuándo se libera el
            // turno si no pagan la seña
            <>
              <CuentaRegresivaSena venceEn={venceSena} />
              <RefreshWhenDepositExpires venceEn={venceSena} />
            </>
          ) : (
            // Mismo alto que la cuenta regresiva: un renglón y, donde iría la
            // barra, una línea divisoria
            <div className="space-y-1.5">
              <p className="text-muted-foreground flex h-7 items-center text-sm">
                {monto?.detalle}
              </p>
              <div className="flex h-1.5 items-center">
                <div className="bg-border h-px flex-1" />
              </div>
            </div>
          )}

          {monto && (
            <div className="mt-3.5">
              <p className="text-muted-foreground text-xs">{monto.etiqueta}</p>
              <p className={`font-heading text-xl leading-tight font-bold ${tonos[monto.tono]}`}>
                {monto.monto}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
