import Image from 'next/image'
import Link from 'next/link'
import { ImageIcon, SearchX } from 'lucide-react'
import { db } from '@/lib/db'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import { filtersToQueryString, searchComplexes } from '@/lib/court-search'
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

function precioMasBajo(canchas: Cancha[]) {
  let minimo = Number(canchas[0].precioBase)
  for (const cancha of canchas) {
    if (Number(cancha.precioBase) < minimo) {
      minimo = Number(cancha.precioBase)
    }
  }
  return minimo
}

export default async function BusquedaCanchasPage({ searchParams }: PageProps<'/jugador/canchas'>) {
  const filtros = searchCourtsSchema.parse(await searchParams)

  const zonas = await db.complejo.findMany({
    where: { activo: true },
    distinct: ['zona'],
    select: { zona: true },
    orderBy: { zona: 'asc' },
  })

  const complejos = await searchComplexes(filtros)

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Buscar canchas</h1>
        <p className="text-muted-foreground mt-2">
          Filtrá por zona, deporte, superficie y precio para encontrar una cancha.
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
            {zonas.map((z) => (
              <option key={z.zona} value={z.zona}>
                {z.zona}
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
