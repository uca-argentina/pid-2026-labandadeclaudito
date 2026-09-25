import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
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
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
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
            Cargar el primer bloqueo
          </Button>
        </div>
      ) : (
        <div className="border-border bg-card mt-8 overflow-hidden rounded-2xl border">
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
                    <TableCell className="text-muted-foreground text-sm">
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
      )}
    </main>
  )
}
