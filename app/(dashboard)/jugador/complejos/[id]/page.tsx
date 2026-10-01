import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { ArrowLeft, BadgeCheck, MapPin, Phone } from 'lucide-react'
import { getComplexDetail, filtersToQueryString } from '@/lib/court-search'
import { searchCourtsSchema } from '@/lib/validations/court-search'
import { CourtCard } from '@/components/court-card'
import { ComplexGallery } from '@/components/complex-gallery'

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

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <Link
        href={`/jugador/canchas${filtersToQueryString(filtros)}`}
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Volver a búsqueda de complejos
      </Link>

      <div className="mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">{complejo.nombre}</h1>
          <span className="bg-primary/15 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
            <BadgeCheck className="size-3.5" />
            Verificado
          </span>
        </div>
        <p className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
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

      <ComplexGallery imagenes={complejo.imagenes} nombreComplejo={complejo.nombre} />

      <h2 className="mb-4 text-lg font-semibold">Canchas disponibles en este complejo</h2>

      {complejo.canchas.length === 0 ? (
        <p className="text-muted-foreground mt-4 text-sm">
          Este complejo todavía no cargó canchas.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {complejo.canchas.map((cancha) => (
            <CourtCard key={cancha.id} cancha={cancha} fechaInicial={filtros.fecha} />
          ))}
        </div>
      )}
    </main>
  )
}
