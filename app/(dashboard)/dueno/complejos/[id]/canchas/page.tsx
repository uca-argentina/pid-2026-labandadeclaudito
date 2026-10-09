import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
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
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'

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
    <main>
      <Link
        href={`/dueno/complejos/${id}`}
        className="text-muted-foreground hover:text-foreground mb-2 inline-flex h-8 items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Volver al complejo
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
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
        <>
          {/* Mobile y tablet: una tarjeta por cancha, porque la tabla no entra */}
          <div className="border-border bg-card divide-border mt-8 divide-y rounded-2xl border lg:hidden">
            {canchas.map((cancha) => (
              <div key={cancha.id} className="space-y-3 p-4">
                <div>
                  <p className="font-semibold">{cancha.nombre}</p>
                  <p className="text-muted-foreground text-sm">
                    {deporteLabels[cancha.deporte]} · {superficieLabels[cancha.tipoSuperficie]}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {formatPrecio(cancha.precioBase.toString())}
                    </span>
                    <span className="text-muted-foreground">
                      {' '}
                      · {cancha.horaApertura} – {cancha.horaCierre}
                    </span>
                  </p>
                  <CourtRowActions complejoId={id} courtId={cancha.id} courtName={cancha.nombre} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabla */}
          <div className="border-border bg-card mt-8 hidden overflow-hidden rounded-2xl border lg:block">
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
                    <TableCell className="whitespace-normal">
                      <span className="mb-1 block font-semibold">{cancha.nombre}</span>
                      <EtiquetaDeporte deporte={cancha.deporte} />
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
        </>
      )}
    </main>
  )
}
