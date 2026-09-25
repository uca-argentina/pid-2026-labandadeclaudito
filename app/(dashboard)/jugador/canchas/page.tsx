import Image from 'next/image'
import Link from 'next/link'
import { ImageIcon, SearchX } from 'lucide-react'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import { filtersToQueryString, getSearchableZones, searchComplexes } from '@/lib/court-search'
import type { CourtWithPrice } from '@/lib/court-search'
import { diaDeHoy } from '@/lib/time'
import { searchCourtsSchema } from '@/lib/validations/court-search'
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

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Buscar canchas</h1>
        <p className="text-muted-foreground mt-2">
          Filtrá por zona, deporte, superficie, precio, fecha y horario para encontrar una cancha.
        </p>
      </div>

      <form
        method="get"
        className="border-border bg-card flex flex-wrap items-end gap-4 rounded-2xl border p-5"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="zona" className="text-sm font-medium">
            Zona
          </label>
          <select
            id="zona"
            name="zona"
            defaultValue={filtros.zona ?? ''}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          >
            <option value="">Todas</option>
            {zonas.map((zona) => (
              <option key={zona} value={zona}>
                {zona}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="deporte" className="text-sm font-medium">
            Deporte
          </label>
          <select
            id="deporte"
            name="deporte"
            defaultValue={filtros.deporte ?? ''}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          >
            <option value="">Todos</option>
            {Object.entries(deporteLabels).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="tipoSuperficie" className="text-sm font-medium">
            Superficie
          </label>
          <select
            id="tipoSuperficie"
            name="tipoSuperficie"
            defaultValue={filtros.tipoSuperficie ?? ''}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          >
            <option value="">Todas</option>
            {Object.entries(superficieLabels).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="precioMin" className="text-sm font-medium">
            Precio mínimo
          </label>
          <input
            id="precioMin"
            name="precioMin"
            type="number"
            min={0}
            step={1}
            placeholder="$"
            defaultValue={filtros.precioMin ?? ''}
            className="border-input bg-background h-9 w-28 rounded-lg border px-3 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="precioMax" className="text-sm font-medium">
            Precio máximo
          </label>
          <input
            id="precioMax"
            name="precioMax"
            type="number"
            min={0}
            step={1}
            placeholder="$"
            defaultValue={filtros.precioMax ?? ''}
            className="border-input bg-background h-9 w-28 rounded-lg border px-3 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="fecha" className="text-sm font-medium">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            min={diaDeHoy()}
            defaultValue={filtros.fecha ?? ''}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="horaDesde" className="text-sm font-medium">
            Desde
          </label>
          <input
            id="horaDesde"
            name="horaDesde"
            type="time"
            defaultValue={filtros.horaDesde ?? ''}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="horaHasta" className="text-sm font-medium">
            Hasta
          </label>
          <input
            id="horaHasta"
            name="horaHasta"
            type="time"
            defaultValue={filtros.horaHasta ?? ''}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          />
        </div>

        <p className="text-muted-foreground w-full text-xs">
          El horario se aplica solo si elegís una fecha. Se muestran las canchas con algún turno
          libre que empiece dentro de esa franja.
        </p>

        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/80 h-9 rounded-lg px-4 text-sm font-medium"
        >
          Buscar
        </button>
        <Link
          href="/jugador/canchas"
          className="text-muted-foreground hover:text-foreground h-9 content-center text-sm underline"
        >
          Limpiar filtros
        </Link>
      </form>

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
