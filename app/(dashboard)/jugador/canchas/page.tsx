import Image from 'next/image'
import Link from 'next/link'
import { ImageIcon, SearchX, X } from 'lucide-react'
import { deporteLabels, formatPrecio } from '@/lib/labels'
import {
  activeFilterChips,
  filtersToQueryString,
  getSearchableZones,
  searchComplexes,
} from '@/lib/court-search'
import type { CourtWithPrice } from '@/lib/court-search'
import { searchCourtsSchema } from '@/lib/validations/court-search'
import { Button } from '@/components/ui/button'
import { SearchFiltersSheet } from '@/components/search-filters-sheet'
import type { Cancha, Deporte } from '@/lib/generated/prisma/client'

function deportesDistintos(canchas: Cancha[]) {
  const deportes: Deporte[] = []
  for (const cancha of canchas) {
    if (!deportes.includes(cancha.deporte)) {
      deportes.push(cancha.deporte)
    }
  }
  return deportes
}

function precioMasBajo(canchas: CourtWithPrice[]) {
  let minimo = canchas[0].priceFrom
  for (const cancha of canchas) {
    if (cancha.priceFrom < minimo) {
      minimo = cancha.priceFrom
    }
  }
  return minimo
}

export default async function BusquedaCanchasPage({ searchParams }: PageProps<'/jugador/canchas'>) {
  const filtros = searchCourtsSchema.parse(await searchParams)

  const zonas = await getSearchableZones()

  const complejos = await searchComplexes(filtros)

  const filtrosAplicados = activeFilterChips(filtros)

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Buscar canchas</h1>
        <p className="text-muted-foreground mt-2">
          Filtrá por zona, deporte, superficie, precio, fecha y horario para encontrar una cancha.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SearchFiltersSheet
          zonas={zonas}
          filtros={filtros}
          cantidadDeFiltros={filtrosAplicados.length}
        />

        {filtrosAplicados.map((filtro) => (
          <Link
            key={filtro.label}
            href={`/jugador/canchas${filtersToQueryString(filtro.withoutIt)}`}
            aria-label={`Quitar filtro ${filtro.label}`}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/70 inline-flex items-center gap-1.5 rounded-full py-1.5 pr-2.5 pl-3.5 text-sm transition-colors"
          >
            {filtro.label}
            <X className="size-3.5" />
          </Link>
        ))}

        {filtrosAplicados.length > 0 && (
          <Button variant="ghost" size="sm" render={<Link href="/jugador/canchas" />}>
            Limpiar todo
          </Button>
        )}
      </div>

      {complejos.length === 0 ? (
        <div className="border-border mt-8 flex flex-col items-center gap-2.5 rounded-2xl border border-dashed p-16 text-center">
          <SearchX className="text-muted-foreground size-8" />
          <h3 className="text-lg font-semibold">No encontramos canchas con esos filtros</h3>
          <p className="text-muted-foreground text-sm">Probá aflojando algún filtro.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {complejos.map((complejo) => {
            const deportes = deportesDistintos(complejo.canchas)
            const precioMinimo = precioMasBajo(complejo.canchas)

            return (
              <Link
                key={complejo.id}
                href={`/jugador/complejos/${complejo.id}${filtersToQueryString(filtros)}`}
                className="border-border bg-card hover:bg-accent block overflow-hidden rounded-2xl border transition-colors"
              >
                {complejo.imagenes.length > 0 ? (
                  <div className="relative aspect-video">
                    <Image
                      src={complejo.imagenes[0].url}
                      alt={`Foto de ${complejo.nombre}`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-muted text-muted-foreground flex aspect-video flex-col items-center justify-center gap-1 text-sm">
                    <ImageIcon className="size-5" />
                    Sin fotos
                  </div>
                )}

                <div className="p-6">
                  <span className="block font-semibold">{complejo.nombre}</span>
                  <span className="text-muted-foreground block text-sm">
                    {complejo.direccion} · {complejo.zona}
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {deportes.map((deporteDeCancha) => (
                      <span
                        key={deporteDeCancha}
                        className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1"
                      >
                        {deporteLabels[deporteDeCancha]}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="text-primary text-lg font-bold">
                      desde {formatPrecio(precioMinimo)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {complejo.canchas.length === 1
                        ? '1 cancha'
                        : `${complejo.canchas.length} canchas`}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
