import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
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
    <main className="w-full max-w-5xl px-6 pt-6 pb-12 md:pt-4">
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
        <>
          {/* Mobile y tablet: una tarjeta por precio, porque la tabla no entra */}
          <div className="border-border bg-card divide-border mt-8 divide-y rounded-2xl border lg:hidden">
            {preciosEspeciales.map((precioEspecial) => (
              <div key={precioEspecial.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">
                    {precioEspecial.diaSemana === null
                      ? 'Todos los días'
                      : diasSemana[precioEspecial.diaSemana]}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {precioEspecial.horaInicio
                      ? `${precioEspecial.horaInicio} – ${precioEspecial.horaFin}`
                      : 'Todo el día'}
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatPrecio(precioEspecial.precio.toString())}
                  </p>
                </div>
                <PriceRowActions complejoId={id} courtId={courtId} priceId={precioEspecial.id} />
              </div>
            ))}
          </div>

          {/* Desktop: tabla */}
          <div className="border-border bg-card mt-8 hidden overflow-hidden rounded-2xl border lg:block">
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
        </>
      )}
    </main>
  )
}
