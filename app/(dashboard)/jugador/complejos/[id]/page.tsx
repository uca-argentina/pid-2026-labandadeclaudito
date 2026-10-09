import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { ArrowLeft, BadgeCheck, MapPin, Phone } from 'lucide-react'
import { getComplexDetail, filtersToQueryString } from '@/lib/court-search'
import { searchCourtsSchema } from '@/lib/validations/court-search'
import { deportesDistintos } from '@/lib/resumen-complejo'
import { bloqueosDelDia, textoDelBloqueo } from '@/lib/blocks'
import { diaDeHoy } from '@/lib/time'
import { CourtCard } from '@/components/court-card'
import { ComplexGallery } from '@/components/complex-gallery'
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'

export default async function ComplejoDetallePage({
  params,
  searchParams,
}: PageProps<'/jugador/complejos/[id]'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const filtros = searchCourtsSchema.parse(await searchParams)

  const complejo = await getComplexDetail(id, filtros, session.user.id)
  if (!complejo) notFound()

  // Una cancha puede tener su propio porcentaje de seña: el número se muestra
  // solo si es el mismo en todas.
  let mismaSenaEnTodas = true
  for (const cancha of complejo.canchas) {
    if (
      cancha.porcentajeSena !== null &&
      cancha.porcentajeSena !== complejo.porcentajeSenaDefault
    ) {
      mismaSenaEnTodas = false
    }
  }

  const sello = (
    <span className="bg-highlight text-highlight-foreground inline-flex h-6.5 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold">
      <BadgeCheck className="size-3.5" />
      Verificado
    </span>
  )

  // Bloqueos del día que se está mirando: el de la búsqueda o, si no hay, hoy
  const idsDeCanchas: string[] = []
  for (const cancha of complejo.canchas) {
    idsDeCanchas.push(cancha.id)
  }
  const bloqueos = await bloqueosDelDia(idsDeCanchas, new Date(filtros.fecha ?? diaDeHoy()))

  return (
    <main>
      <Link
        href={`/jugador/canchas${filtersToQueryString(filtros)}`}
        className="text-muted-foreground hover:text-foreground mb-1 inline-flex h-11 items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="size-4" />
        Volver a la búsqueda
      </Link>

      {/* Con fotos, el nombre va escrito sobre la portada; sin fotos, arriba */}
      {complejo.imagenes.length > 0 ? (
        <ComplexGallery imagenes={complejo.imagenes} nombreComplejo={complejo.nombre}>
          {sello}
          <h1 className="font-heading mt-2.5 text-3xl font-bold tracking-tight sm:text-4xl">
            {complejo.nombre}
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" />
            {complejo.direccion} · {complejo.zona}
          </p>
        </ComplexGallery>
      ) : (
        <div className="mb-7">
          {sello}
          <h1 className="font-heading mt-2.5 text-4xl font-bold tracking-tight">
            {complejo.nombre}
          </h1>
        </div>
      )}

      <div className="grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* min-w-0: sin esto, en celular la columna se ensancha hasta el texto
            más largo de las filas y la página se desborda de costado */}
        <section className="min-w-0">
          <h2 className="font-heading mb-3.5 px-1 text-xl font-bold">Elegí tu cancha</h2>

          {complejo.canchas.length === 0 ? (
            <p className="text-muted-foreground px-1 text-sm">
              {filtersToQueryString(filtros) === ''
                ? 'Este complejo todavía no cargó canchas.'
                : 'Ninguna cancha de este complejo cumple los filtros de tu búsqueda.'}
            </p>
          ) : (
            // Dos por fila recién en 2xl: al lado de la ficha, en lg la columna es angosta
            <div className="grid gap-3.5 2xl:grid-cols-2">
              {complejo.canchas.map((cancha) => {
                const bloqueosDeLaCancha = bloqueos.filter((b) => b.courtId === cancha.id)
                return (
                  <CourtCard
                    key={cancha.id}
                    cancha={cancha}
                    fechaInicial={filtros.fecha}
                    bloqueo={
                      bloqueosDeLaCancha.length > 0
                        ? textoDelBloqueo(bloqueosDeLaCancha, false)
                        : undefined
                    }
                  />
                )
              })}
            </div>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="bg-card shadow-card rounded-3xl p-6">
            <div className="space-y-3.5">
              <p className="flex items-center gap-3">
                <span className="bg-muted flex size-9.5 shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="size-4.5" />
                </span>
                {complejo.direccion} · {complejo.zona}
              </p>
              <p className="flex items-center gap-3">
                <span className="bg-muted flex size-9.5 shrink-0 items-center justify-center rounded-xl">
                  <Phone className="size-4.5" />
                </span>
                {complejo.contacto}
              </p>
            </div>
            <div className="border-border mt-4.5 flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="mr-1 font-semibold">
                {complejo.canchas.length === 1 ? '1 cancha' : `${complejo.canchas.length} canchas`}
              </span>
              {deportesDistintos(complejo.canchas).map((deporte) => (
                <EtiquetaDeporte key={deporte} deporte={deporte} />
              ))}
            </div>
          </div>

          {/* Cómo se paga y qué pasa si cancela: lo que el jugador quiere saber antes de reservar */}
          <div className="bg-clay/12 rounded-3xl px-7 py-6">
            <p className="font-heading text-xl font-bold">
              {mismaSenaEnTodas
                ? `Reservás con una seña del ${complejo.porcentajeSenaDefault}%`
                : 'Reservás con una seña'}
            </p>
            <p className="text-foreground/80 mt-1.5 text-sm">
              El resto lo pagás en el complejo. Si cancelás hasta {complejo.cancellationHours} hs
              antes del turno, te devolvemos la seña.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
