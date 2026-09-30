import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { getComplexByOwner } from '@/lib/ownership'
import { formatPrecio } from '@/lib/labels'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PriceRowActions } from '@/components/price-row-actions'

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default async function ListadoPreciosPage({
  params,
}: PageProps<'/dueno/complejos/[id]/canchas/[courtId]/precios'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id, courtId } = await params
  const complejo = await getComplexByOwner(id, session.user.id)
  if (!complejo) redirect('/dueno')

  const cancha = await db.cancha.findFirst({
    where: { id: courtId, complejoId: id, activo: true },
  })
  if (!cancha) redirect(`/dueno/complejos/${id}/canchas`)

  const preciosEspeciales = await db.precioEspecial.findMany({
    where: { canchaId: courtId, activo: true },
    orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
  })

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Precios especiales de {cancha.nombre}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Precio base: {formatPrecio(cancha.precioBase.toString())}. Acá podés poner precios
            distintos por día u horario.
          </p>
        </div>
        <Button render={<Link href={`/dueno/complejos/${id}/canchas/${courtId}/precios/nuevo`} />}>
          <Plus className="size-4" />
          Nuevo precio
        </Button>
      </div>

      {preciosEspeciales.length === 0 ? (
        <div className="border-border mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center">
          <h3 className="text-lg font-semibold">Todavía no cargaste ningún precio especial</h3>
          <p className="text-muted-foreground max-w-md text-sm">
            Mientras tanto se usa el precio base en todos los turnos. Cargá uno para cobrar
            distinto, por ejemplo, los fines de semana o en horario pico.
          </p>
          <Button
            render={<Link href={`/dueno/complejos/${id}/canchas/${courtId}/precios/nuevo`} />}
          >
            <Plus className="size-4" />
            Cargar precio especial
          </Button>
        </div>
      ) : (
        <div className="border-border bg-card mt-8 overflow-hidden rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Día</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preciosEspeciales.map((precioEspecial) => (
                <TableRow key={precioEspecial.id}>
                  <TableCell>
                    {precioEspecial.diaSemana === null
                      ? 'Todos los días'
                      : diasSemana[precioEspecial.diaSemana]}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {precioEspecial.horaInicio
                      ? `${precioEspecial.horaInicio} – ${precioEspecial.horaFin}`
                      : 'Todo el día'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrecio(precioEspecial.precio.toString())}
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceRowActions
                      complejoId={id}
                      courtId={courtId}
                      priceId={precioEspecial.id}
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
