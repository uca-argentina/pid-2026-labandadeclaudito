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
import { EstadoVacio } from '@/components/estado-vacio'
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'
import { AvisoBloqueo } from '@/components/aviso-bloqueo'
import { bloqueosDelDia, textoDelBloqueo } from '@/lib/blocks'
import { diaDeHoy } from '@/lib/time'

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

  // Bloqueos de hoy: la cancha bloqueada va en gris, con la franja y el motivo
  const idsDeCanchas: string[] = []
  for (const cancha of canchas) {
    idsDeCanchas.push(cancha.id)
  }
  const bloqueos = await bloqueosDelDia(idsDeCanchas, new Date(diaDeHoy()))

  function textoDeBloqueoDe(canchaId: string): string | null {
    const bloqueosDeLaCancha = bloqueos.filter((b) => b.courtId === canchaId)
    return bloqueosDeLaCancha.length > 0 ? textoDelBloqueo(bloqueosDeLaCancha, true) : null
  }

  return (
    <main>
      <Link
        href={`/dueno/complejos/${id}`}
        className="text-muted-foreground hover:text-foreground mb-1 inline-flex h-11 items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Volver al complejo
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{complejo.nombre}</p>
          <h1 className="font-heading mt-1 text-4xl font-bold tracking-tight">Canchas</h1>
          <p className="text-muted-foreground mt-1.5">
            Desde cada cancha cargás sus precios especiales y sus bloqueos.
          </p>
        </div>
        <Button render={<Link href={`/dueno/complejos/${id}/canchas/nueva`} />}>
          <Plus className="size-4" />
          Nueva cancha
        </Button>
      </div>
      {canchas.length === 0 ? (
        <div className="mt-7">
          <EstadoVacio
            titulo="Todavía no cargaste ninguna cancha"
            texto="Sin canchas, el complejo no aparece en la búsqueda de los jugadores."
          >
            <Button render={<Link href={`/dueno/complejos/${id}/canchas/nueva`} />}>
              <Plus className="size-4" />
              Cargar mi primera cancha
            </Button>
          </EstadoVacio>
        </div>
      ) : (
        <>
          {/* Mobile y tablet: una tarjeta por cancha, porque la tabla no entra */}
          <div className="bg-card shadow-card divide-border mt-7 divide-y rounded-2xl lg:hidden">
            {canchas.map((cancha) => {
              const bloqueo = textoDeBloqueoDe(cancha.id)
              return (
                <div
                  key={cancha.id}
                  className={`space-y-3 p-4 ${bloqueo ? 'opacity-60 grayscale' : ''}`}
                >
                  <div>
                    <p className="font-semibold">{cancha.nombre}</p>
                    <p className="text-muted-foreground text-sm">
                      {deporteLabels[cancha.deporte]} · {superficieLabels[cancha.tipoSuperficie]}
                    </p>
                    {bloqueo && (
                      <div className="mt-1">
                        <AvisoBloqueo texto={bloqueo} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm">
                      <span className="font-heading text-primary text-base font-bold">
                        {formatPrecio(cancha.precioBase.toString())}
                      </span>
                      <span className="text-muted-foreground">
                        {' '}
                        · {cancha.horaApertura} – {cancha.horaCierre}
                      </span>
                    </p>
                    <CourtRowActions
                      complejoId={id}
                      courtId={cancha.id}
                      courtName={cancha.nombre}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop: tabla */}
          <div className="bg-card shadow-card mt-7 hidden overflow-hidden rounded-2xl lg:block">
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
                {canchas.map((cancha) => {
                  const bloqueo = textoDeBloqueoDe(cancha.id)
                  return (
                    <TableRow
                      key={cancha.id}
                      className={bloqueo ? 'opacity-60 grayscale' : undefined}
                    >
                      <TableCell className="whitespace-normal">
                        <span className="mb-1 block font-semibold">{cancha.nombre}</span>
                        <EtiquetaDeporte deporte={cancha.deporte} />
                        {bloqueo && (
                          <div className="mt-1.5">
                            <AvisoBloqueo texto={bloqueo} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{superficieLabels[cancha.tipoSuperficie]}</Badge>
                      </TableCell>
                      <TableCell className="font-heading text-primary text-base font-bold">
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
