import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarClock, CalendarDays, CircleDot, LandPlot, User, Wallet } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { pendientesVencidas } from '@/lib/bookings'
import { estadoDeReserva } from '@/lib/estado-reserva'
import { montoDelHistorial } from '@/lib/historial'
import { homePorRol } from '@/lib/home-por-rol'
import { grupoDeEstadoLabels } from '@/lib/labels'
import { calcularPagina } from '@/lib/paginacion'
import { diaDeHoy, diaDeReserva, momentoActual, turnoYaPaso } from '@/lib/time'
import {
  contarPorGrupo,
  grupoDelEstado,
  gruposDeEstado,
  rangoDeFechas,
  urlDeReservasGlobales,
  type FiltrosDeReservas,
  type GrupoDeEstado,
} from '@/lib/admin-bookings'
import { adminBookingsFiltersSchema } from '@/lib/validations/admin-bookings'
import { AdminBookingsFilters } from '@/components/admin-bookings-filters'
import { BookingStatusBadge } from '@/components/booking-status-badge'
import { CeldaCancha, CeldaMonto } from '@/components/celdas-reserva'
import { FechaDelTurno } from '@/components/fecha-del-turno'
import { Paginacion } from '@/components/paginacion'
import { TituloConIcono } from '@/components/titulo-con-icono'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const FILAS_POR_PAGINA = 20

// Las reservas de la página, con todo lo que muestra la tabla. Del jugador
// solo nombre y email: nunca traer el usuario entero (tiene el passwordHash).
async function getReservasPorId(ids: string[]) {
  return db.reserva.findMany({
    where: { id: { in: ids } },
    include: {
      cancha: { include: { complejo: true } },
      jugador: { select: { nombre: true, email: true } },
      pago: true,
    },
    orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
  })
}

type Reserva = Awaited<ReturnType<typeof getReservasPorId>>[number]

export default async function AdminReservasPage({ searchParams }: PageProps<'/admin/reservas'>) {
  // El proxy ya filtra por rol, pero la página lo vuelve a chequear (CLAUDE.md:
  // el rol se verifica server-side en cada página)
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.rol !== 'ADMIN') redirect(homePorRol(session.user.rol))

  const parametros = await searchParams
  const filtrosDeLaUrl = adminBookingsFiltersSchema.parse(parametros)
  const rango = rangoDeFechas(filtrosDeLaUrl.desde, filtrosDeLaUrl.hasta, diaDeHoy())

  // Todos los complejos, también los dados de baja: sus reservas viejas existen.
  // Si en la URL viene un complejo que no existe, se ven todos.
  const complejos = await db.complejo.findMany({
    select: { id: true, nombre: true, activo: true },
    orderBy: { nombre: 'asc' },
  })
  let complejoId: string | undefined = undefined
  for (const complejo of complejos) {
    if (complejo.id === filtrosDeLaUrl.complejoId) complejoId = complejo.id
  }

  const filtros: FiltrosDeReservas = {
    estado: filtrosDeLaUrl.estado,
    complejoId,
    desde: rango.desde,
    hasta: rango.hasta,
  }

  // 1) Todas las reservas del período, solo con lo que hace falta para saber
  // su estado. Los estados En curso, Finalizada y No se presentó no están en
  // la base (salen del reloj y de la asistencia): por eso se calculan acá y no
  // se pueden filtrar en el where.
  const reservasDelPeriodo = await db.reserva.findMany({
    where: {
      fecha: { gte: new Date(rango.desde), lte: new Date(rango.hasta) },
      cancha: { complejoId },
      NOT: pendientesVencidas(),
    },
    select: { id: true, estado: true, asistio: true, fecha: true, horaInicio: true, horaFin: true },
    orderBy: [{ fecha: 'desc' }, { horaInicio: 'desc' }],
  })

  // 2) El estado de cada una: se cuentan todas y se guardan las del estado elegido
  const ahora = momentoActual()
  const grupos: GrupoDeEstado[] = []
  const idsDelEstadoElegido: string[] = []
  for (const reserva of reservasDelPeriodo) {
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
    const grupo = grupoDelEstado(estado)
    grupos.push(grupo)
    if (filtros.estado === undefined || grupo === filtros.estado) {
      idsDelEstadoElegido.push(reserva.id)
    }
  }
  const conteo = contarPorGrupo(grupos)

  // 3) Recién ahora se traen completas, y solo las de esta página
  const { paginaActual, totalPaginas, skip } = calcularPagina(
    parametros.pagina,
    idsDelEstadoElegido.length,
    FILAS_POR_PAGINA,
  )
  const idsDeLaPagina = idsDelEstadoElegido.slice(skip, skip + FILAS_POR_PAGINA)
  const reservas = await getReservasPorId(idsDeLaPagina)

  return (
    <main className="max-w-6xl px-6 pt-6 pb-12 md:pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Reservas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Todas las reservas de la plataforma en el período elegido.
        </p>
      </div>

      <AdminBookingsFilters
        complejos={complejos}
        complejoId={complejoId}
        desde={rango.desde}
        hasta={rango.hasta}
        estado={filtros.estado}
      />

      {/* Tarjetas de conteo: cada una es un link que filtra por ese estado */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <TarjetaDeConteo
          titulo="Todas"
          cantidad={reservasDelPeriodo.length}
          href={urlDeReservasGlobales({ ...filtros, estado: undefined })}
          elegida={filtros.estado === undefined}
        />
        {gruposDeEstado.map((grupo) => (
          <TarjetaDeConteo
            key={grupo}
            titulo={grupoDeEstadoLabels[grupo]}
            cantidad={conteo[grupo]}
            href={urlDeReservasGlobales({ ...filtros, estado: grupo })}
            elegida={filtros.estado === grupo}
          />
        ))}
      </div>

      {reservas.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-8 text-center">
          <CalendarClock className="text-muted-foreground mx-auto mb-3 size-8" />
          <p className="font-medium">No hay reservas con estos filtros</p>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Probá con otro período, otro complejo u otro estado.
          </p>
        </div>
      ) : (
        <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
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
                <TableHead>
                  <TituloConIcono icono={CircleDot}>Estado</TituloConIcono>
                </TableHead>
                <TableHead className="hidden pr-4 xl:table-cell">
                  <TituloConIcono icono={Wallet}>Monto</TituloConIcono>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservas.map((reserva) => (
                <FilaReserva key={reserva.id} reserva={reserva} ahora={ahora} />
              ))}
            </TableBody>
          </Table>
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            desde={skip + 1}
            hasta={skip + reservas.length}
            total={idsDelEstadoElegido.length}
            urlAnterior={urlDeReservasGlobales({ ...filtros, pagina: paginaActual - 1 })}
            urlSiguiente={urlDeReservasGlobales({ ...filtros, pagina: paginaActual + 1 })}
          />
        </div>
      )}
    </main>
  )
}

function TarjetaDeConteo({
  titulo,
  cantidad,
  href,
  elegida,
}: {
  titulo: string
  cantidad: number
  href: string
  elegida: boolean
}) {
  return (
    <Link
      href={href}
      className={
        elegida
          ? 'border-primary bg-primary/10 rounded-2xl border p-4'
          : 'border-border bg-card hover:bg-muted rounded-2xl border p-4'
      }
    >
      <p className="text-muted-foreground text-sm">{titulo}</p>
      <p className="mt-1 text-2xl font-semibold">{cantidad}</p>
    </Link>
  )
}

function FilaReserva({
  reserva,
  ahora,
}: {
  reserva: Reserva
  ahora: { dia: string; hora: string }
}) {
  const dia = diaDeReserva(reserva.fecha)
  // El monto, contado como lo ve el complejo (cobrado, retenido, devuelto)
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

  return (
    <TableRow>
      <TableCell className="pl-4">
        <FechaDelTurno dia={dia} horaInicio={reserva.horaInicio} horaFin={reserva.horaFin} />
        {/* En celular no entra la columna Cancha: se muestra acá abajo */}
        <p className="text-muted-foreground mt-1.5 text-xs sm:hidden">
          {reserva.cancha.nombre} · {reserva.cancha.complejo.nombre}
        </p>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <CeldaCancha
          nombre={reserva.cancha.nombre}
          deporte={reserva.cancha.deporte}
          complejo={reserva.cancha.complejo.nombre}
        />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <p className="font-medium">{reserva.jugador.nombre}</p>
        <p className="text-muted-foreground text-xs">{reserva.jugador.email}</p>
      </TableCell>
      {/* Muestra el estado real: una "Asistió" se cuenta en Finalizadas, pero
          acá se ve como Asistió */}
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
      <TableCell className="hidden pr-4 xl:table-cell">
        <CeldaMonto monto={monto} />
      </TableCell>
    </TableRow>
  )
}
