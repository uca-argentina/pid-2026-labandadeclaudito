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
import { EstadoVacio } from '@/components/estado-vacio'
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
          <h1 className="font-heading mt-1 text-4xl font-bold tracking-tight">
            Precios especiales
          </h1>
          <p className="text-muted-foreground mt-1.5">
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
        <div className="mt-7">
          <EstadoVacio
            titulo="Todavía no cargaste ningún precio especial"
            texto="Mientras tanto se usa el precio base en todos los turnos. Cargá uno para cobrar distinto, por ejemplo, los fines de semana o en horario pico."
          >
            <Button
              render={<Link href={`/dueno/complejos/${id}/canchas/${courtId}/precios/nuevo`} />}
            >
              <Plus className="size-4" />
              Cargar precio especial
            </Button>
          </EstadoVacio>
        </div>
      ) : (
        <>
          {/* Mobile y tablet: una tarjeta por precio, porque la tabla no entra */}
          <div className="bg-card shadow-card divide-border mt-7 divide-y rounded-2xl lg:hidden">
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
                  <p className="font-heading text-primary mt-1 font-bold">
                    {formatPrecio(precioEspecial.precio.toString())}
                  </p>
                </div>
                <PriceRowActions complejoId={id} courtId={courtId} priceId={precioEspecial.id} />
              </div>
            ))}
          </div>

          {/* Desktop: tabla */}
          <div className="bg-card shadow-card mt-7 hidden overflow-hidden rounded-2xl lg:block">
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
                    <TableCell className="font-heading text-primary text-base font-bold">
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
