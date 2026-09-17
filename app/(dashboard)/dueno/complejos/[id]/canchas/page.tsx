import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getComplexByOwner } from '@/lib/ownership'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CourtRowActions } from '@/components/court-row-actions'

export default async function ListadoCanchasPage({
  params,
}: PageProps<'/dueno/complejos/[id]/canchas'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) redirect('/dueno')

  const canchas = await db.cancha.findMany({
    where: { complejoId: id, activo: true },
    orderBy: { nombre: 'asc' },
  })

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{complejo.nombre}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{complejo.direccion}</p>
        </div>
        <Button render={<Link href={`/dueno/complejos/${id}/canchas/nueva`} />}>
          <Plus className="size-4" />
          Nueva cancha
        </Button>
      </div>

      {canchas.length === 0 ? (
        <div className="border-border mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center">
          <h3 className="text-lg font-semibold">Todavía no cargaste ninguna cancha</h3>
          <p className="text-muted-foreground max-w-md text-sm">
            Cargá las canchas y turnos para habilitar la disponibilidad inmediata en la búsqueda de
            los jugadores.
          </p>
          <Button render={<Link href={`/dueno/complejos/${id}/canchas/nueva`} />}>
            <Plus className="size-4" />
            Cargar mi primera cancha
          </Button>
        </div>
      ) : (
        <div className="border-border bg-card mt-8 overflow-hidden rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cancha</TableHead>
                <TableHead>Superficie</TableHead>
                <TableHead>Precio / turno</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {canchas.map((cancha) => (
                <TableRow key={cancha.id}>
                  <TableCell>
                    <span className="block font-semibold">{cancha.nombre}</span>
                    <span className="text-muted-foreground text-sm">
                      {deporteLabels[cancha.deporte]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{superficieLabels[cancha.tipoSuperficie]}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatPrecio(cancha.precioBase.toString())}
                  </TableCell>
                  <TableCell>
                    {cancha.horaApertura} – {cancha.horaCierre}
                  </TableCell>
                  <TableCell className="text-right">
                    <CourtRowActions
                      complejoId={id}
                      courtId={cancha.id}
                      courtName={cancha.nombre}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  )
}
