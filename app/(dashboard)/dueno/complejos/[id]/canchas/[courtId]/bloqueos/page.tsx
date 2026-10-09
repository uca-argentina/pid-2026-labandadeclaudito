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
        className="text-muted-foreground hover:text-foreground mb-2 inline-flex h-8 items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Volver a canchas
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">{complejo.nombre}</p>
          <h1 className="text-3xl font-semibold">Bloqueos de {cancha.nombre}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Horarios cerrados por mantenimiento, eventos privados u otros motivos.
          </p>
        </div>
        <Button render={<Link href={`/dueno/complejos/${id}/canchas/${courtId}/bloqueos/nuevo`} />}>
          <Plus className="size-4" />
          Nuevo bloqueo
        </Button>
      </div>

      {bloqueos.length === 0 ? (
        <div className="border-border mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center">
          <h3 className="text-lg font-semibold">Todavía no cargaste ningún bloqueo</h3>
          <p className="text-muted-foreground max-w-md text-sm">
            Cargá un bloqueo para cerrar esta cancha en un rango de fechas y horario, por ejemplo
            para mantenimiento.
          </p>
          <Button
            render={<Link href={`/dueno/complejos/${id}/canchas/${courtId}/bloqueos/nuevo`} />}
          >
            <Plus className="size-4" />
            Cargar bloqueo
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile y tablet: una tarjeta por bloqueo, porque la tabla no entra */}
          <div className="border-border bg-card divide-border mt-8 divide-y rounded-2xl border lg:hidden">
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
          <div className="border-border bg-card mt-8 hidden overflow-hidden rounded-2xl border lg:block">
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
