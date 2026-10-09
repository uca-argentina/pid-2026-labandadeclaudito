import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { ArrowLeft, BadgeCheck, MapPin, Phone, Shapes, Wallet } from 'lucide-react'
import { getComplexDetail, filtersToQueryString } from '@/lib/court-search'
import { searchCourtsSchema } from '@/lib/validations/court-search'
import { formatPrecio } from '@/lib/labels'
import { deportesDistintos, precioMasBajo } from '@/lib/resumen-complejo'
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

  const precioDesde = precioMasBajo(complejo.canchas)

  return (
    <main>
      <Link
        href={`/jugador/canchas${filtersToQueryString(filtros)}`}
        className="text-muted-foreground hover:text-foreground mb-2 inline-flex h-8 items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Volver a búsqueda de complejos
      </Link>

      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold">{complejo.nombre}</h1>
          <span className="bg-primary/15 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
            <BadgeCheck className="size-3.5" />
            Verificado
          </span>
        </div>
        {/* En lg dirección y contacto están en la ficha del costado */}
        <p className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm lg:hidden">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            {complejo.direccion} · {complejo.zona}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="size-3.5 shrink-0" />
            {complejo.contacto}
          </span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section>
          <ComplexGallery imagenes={complejo.imagenes} nombreComplejo={complejo.nombre} />

          <h2 className="mb-4 text-lg font-semibold">Canchas disponibles en este complejo</h2>

          {complejo.canchas.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">
              Este complejo todavía no cargó canchas.
            </p>
          ) : (
            // Dos por fila recién en 2xl: al lado de la ficha, en lg la columna es angosta
            <div className="mt-6 grid gap-5 2xl:grid-cols-2">
              {complejo.canchas.map((cancha) => (
                <CourtCard key={cancha.id} cancha={cancha} fechaInicial={filtros.fecha} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="border-border bg-card space-y-4 rounded-2xl border p-5 text-sm">
            <p className="flex items-start gap-2">
              <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              {complejo.direccion} · {complejo.zona}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="text-muted-foreground size-4 shrink-0" />
              {complejo.contacto}
            </p>
            <p className="flex items-center gap-2">
              <Shapes className="text-muted-foreground size-4 shrink-0" />
              {complejo.canchas.length === 1 ? '1 cancha' : `${complejo.canchas.length} canchas`}
            </p>
            {complejo.canchas.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {deportesDistintos(complejo.canchas).map((deporte) => (
                  <EtiquetaDeporte key={deporte} deporte={deporte} />
                ))}
              </div>
            )}
            {precioDesde !== null && (
              <div className="border-border flex items-center gap-1.5 border-t pt-4">
                <Wallet className="text-primary size-4 shrink-0" />
                <span className="text-muted-foreground text-xs">desde</span>
                <span className="text-primary text-lg font-bold">{formatPrecio(precioDesde)}</span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}
