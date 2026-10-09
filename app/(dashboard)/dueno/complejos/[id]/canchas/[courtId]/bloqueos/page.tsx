import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getComplexByOwner } from '@/lib/ownership'
import { diaDeReserva, formatearDia } from '@/lib/time'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EstadoVacio } from '@/components/estado-vacio'
import { BlockRowActions } from '@/components/block-row-actions'

export default async function ListadoBloqueosPage({
  params,
}: PageProps<'/dueno/complejos/[id]/canchas/[courtId]/bloqueos'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id, courtId } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) redirect('/dueno')

  const cancha = await db.cancha.findFirst({
    where: { id: courtId, complejoId: id, activo: true },
  })
  if (!cancha) redirect(`/dueno/complejos/${id}/canchas`)

  const bloqueos = await db.block.findMany({
    where: { courtId },
    orderBy: [{ startDate: 'asc' }, { startTime: 'asc' }],
  })

  return (
    <main>
      <Link
        href={`/dueno/complejos/${id}/canchas`}
        className="text-muted-foreground hover:text-foreground mb-1 inline-flex h-11 items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Volver a canchas
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            {complejo.nombre} · {cancha.nombre}
          </p>
          <h1 className="font-heading mt-1 text-4xl font-bold tracking-tight">Bloqueos</h1>
          <p className="text-muted-foreground mt-1.5">
            Horarios cerrados por mantenimiento, eventos privados u otros motivos.
          </p>
        </div>
        <Button render={<Link href={`/dueno/complejos/${id}/canchas/${courtId}/bloqueos/nuevo`} />}>
          <Plus className="size-4" />
          Nuevo bloqueo
        </Button>
      </div>

      {bloqueos.length === 0 ? (
        <div className="mt-7">
          <EstadoVacio
            titulo="Todavía no cargaste ningún bloqueo"
            texto="Cargá un bloqueo para cerrar esta cancha en un rango de fechas y horario, por ejemplo para mantenimiento."
          >
            <Button
              render={<Link href={`/dueno/complejos/${id}/canchas/${courtId}/bloqueos/nuevo`} />}
            >
              <Plus className="size-4" />
              Cargar bloqueo
            </Button>
          </EstadoVacio>
        </div>
      ) : (
        <>
          {/* Mobile y tablet: una tarjeta por bloqueo, porque la tabla no entra */}
          <div className="bg-card shadow-card divide-border mt-7 divide-y rounded-2xl lg:hidden">
            {bloqueos.map((bloqueo) => {
              const desde = formatearDia(diaDeReserva(bloqueo.startDate))
              const hasta = formatearDia(diaDeReserva(bloqueo.endDate))
              return (
                <div key={bloqueo.id} className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium">
                      {desde}
                      {desde !== hasta && <> – {hasta}</>}
                    </p>
                    <p className="text-sm">
                      {bloqueo.startTime} – {bloqueo.endTime}
                    </p>
                    {bloqueo.reason && (
                      <p className="text-muted-foreground mt-1 text-sm">{bloqueo.reason}</p>
                    )}
                  </div>
                  <BlockRowActions complejoId={id} courtId={courtId} blockId={bloqueo.id} />
                </div>
              )
            })}
          </div>

          {/* Desktop: tabla */}
          <div className="bg-card shadow-card mt-7 hidden overflow-hidden rounded-2xl lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloqueos.map((bloqueo) => {
                  const desde = formatearDia(diaDeReserva(bloqueo.startDate))
                  const hasta = formatearDia(diaDeReserva(bloqueo.endDate))
                  return (
                    <TableRow key={bloqueo.id}>
                      <TableCell>
                        {desde}
                        {desde !== hasta && <> – {hasta}</>}
                      </TableCell>
                      <TableCell>
                        {bloqueo.startTime} – {bloqueo.endTime}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-normal">
                        {bloqueo.reason || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <BlockRowActions complejoId={id} courtId={courtId} blockId={bloqueo.id} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </main>
  )
}
