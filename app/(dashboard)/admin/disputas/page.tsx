import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarDays, CalendarPlus, CircleDot, LandPlot, ShieldAlert, User } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { iniciales } from '@/lib/iniciales'
import { calcularPagina } from '@/lib/paginacion'
import { diaDeReserva, formatearDia, momentoActual } from '@/lib/time'
import { EstadoDeDisputa } from '@/components/estado-de-disputa'
import { EstadoVacio } from '@/components/estado-vacio'
import { FechaDelTurno } from '@/components/fecha-del-turno'
import { TituloConIcono } from '@/components/titulo-con-icono'
import { Paginacion } from '@/components/paginacion'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const DISPUTAS_POR_PAGINA = 20

// Pestañas del filtro (Abiertas / Resueltas), con el mismo estilo que las de
// Reservas: la elegida va en verde oscuro y su contador en amarillo.
function clasePestania(elegida: boolean) {
  return elegida
    ? 'bg-sidebar text-sidebar-foreground inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold'
    : 'text-foreground/80 hover:bg-muted inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium'
}

function claseContador(elegida: boolean) {
  return elegida
    ? 'bg-highlight text-highlight-foreground inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs font-bold'
    : 'bg-muted inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs font-semibold'
}

export default async function DisputasDelAdminPage({ searchParams }: PageProps<'/admin/disputas'>) {
  const session = await auth()
  if (!session) redirect('/login')

  // ?filtro=resueltas muestra las ya decididas, ?pagina=2 la página
  const { filtro, pagina } = await searchParams
  const soloResueltas = filtro === 'resueltas'

  const [totalAbiertas, totalResueltas] = await Promise.all([
    db.disputa.count({ where: { estado: 'ABIERTA' } }),
    db.disputa.count({ where: { estado: 'RESUELTA' } }),
  ])
  const total = soloResueltas ? totalResueltas : totalAbiertas

  const { paginaActual, totalPaginas, skip } = calcularPagina(pagina, total, DISPUTAS_POR_PAGINA)

  const disputas = await db.disputa.findMany({
    where: { estado: soloResueltas ? 'RESUELTA' : 'ABIERTA' },
    include: {
      reserva: { include: { cancha: { include: { complejo: true } } } },
      jugador: true,
    },
    // Las más nuevas primero: son las que están corriendo plazo
    orderBy: { createdAt: 'desc' },
    skip,
    take: DISPUTAS_POR_PAGINA,
  })

  function urlDe(cambios: { resueltas?: boolean; pagina?: number }) {
    const resueltas = cambios.resueltas ?? soloResueltas
    const paginaDelLink = cambios.pagina ?? 1

    const params = new URLSearchParams()
    if (resueltas) params.set('filtro', 'resueltas')
    if (paginaDelLink > 1) params.set('pagina', String(paginaDelLink))
    return `/admin/disputas?${params.toString()}`
  }

  return (
    <main>
      <h1 className="font-heading text-4xl font-bold tracking-tight">Disputas</h1>
      <p className="text-muted-foreground mt-1.5">
        Turnos en los que el jugador no está de acuerdo con la falta que le cargó el complejo.
      </p>

      {totalAbiertas + totalResueltas === 0 ? (
        <div className="mt-7">
          <EstadoVacio
            titulo="No hay disputas"
            texto="Cuando un jugador cuestione una falta, su reclamo va a aparecer acá para que lo resuelvas."
          />
        </div>
      ) : (
        <>
          <div className="bg-card shadow-soft mt-6 inline-flex flex-wrap gap-1 rounded-2xl p-1">
            <Link href={urlDe({ resueltas: false })} className={clasePestania(!soloResueltas)}>
              Abiertas
              <span className={claseContador(!soloResueltas)}>{totalAbiertas}</span>
            </Link>
            <Link href={urlDe({ resueltas: true })} className={clasePestania(soloResueltas)}>
              Resueltas
              <span className={claseContador(soloResueltas)}>{totalResueltas}</span>
            </Link>
          </div>

          {disputas.length === 0 ? (
            <p className="text-muted-foreground mt-6 text-sm">
              {soloResueltas ? 'Todavía no se resolvió ninguna.' : 'No hay disputas sin resolver.'}
            </p>
          ) : (
            <div className="bg-card shadow-card mt-5 overflow-hidden rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">
                      <TituloConIcono icono={User}>Jugador</TituloConIcono>
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      <TituloConIcono icono={CalendarDays}>Turno</TituloConIcono>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <TituloConIcono icono={LandPlot}>Cancha</TituloConIcono>
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      <TituloConIcono icono={CalendarPlus}>Abierta</TituloConIcono>
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      <TituloConIcono icono={CircleDot}>Estado</TituloConIcono>
                    </TableHead>
                    <TableHead className="pr-4 text-right">
                      <TituloConIcono icono={ShieldAlert}>Acción</TituloConIcono>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputas.map((disputa) => (
                    <TableRow key={disputa.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-primary/15 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                            {iniciales(disputa.jugador.nombre)}
                          </div>
                          <div>
                            <p className="font-medium">{disputa.jugador.nombre}</p>
                            <p className="text-muted-foreground text-xs">{disputa.jugador.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <FechaDelTurno
                          dia={diaDeReserva(disputa.reserva.fecha)}
                          horaInicio={disputa.reserva.horaInicio}
                          horaFin={disputa.reserva.horaFin}
                        />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <p className="font-medium">{disputa.reserva.cancha.nombre}</p>
                        <p className="text-muted-foreground text-xs">
                          {disputa.reserva.cancha.complejo.nombre}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden text-sm xl:table-cell">
                        {formatearDia(momentoActual(disputa.createdAt).dia)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <EstadoDeDisputa disputa={disputa} vista="ADMIN" />
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          render={<Link href={`/admin/disputas/${disputa.id}`} />}
                        >
                          {disputa.estado === 'ABIERTA' ? 'Resolver' : 'Ver'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                desde={skip + 1}
                hasta={skip + disputas.length}
                total={total}
                urlAnterior={urlDe({ pagina: paginaActual - 1 })}
                urlSiguiente={urlDe({ pagina: paginaActual + 1 })}
              />
            </div>
          )}
        </>
      )}
    </main>
  )
}
