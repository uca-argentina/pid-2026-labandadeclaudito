import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { db } from '@/lib/db'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import type { Deporte } from '@/lib/generated/prisma/client'

export default async function BusquedaCanchasPage({
  searchParams,
}: PageProps<'/jugador/canchas'>) {
  const { zona, deporte } = await searchParams
  const zonaFiltro = typeof zona === 'string' && zona !== '' ? zona : undefined
  const deporteFiltro = typeof deporte === 'string' && deporte !== '' ? (deporte as Deporte) : undefined

  const zonas = await db.complejo.findMany({
    distinct: ['zona'],
    select: { zona: true },
    orderBy: { zona: 'asc' },
  })

  const canchas = await db.cancha.findMany({
    where: {
      deporte: deporteFiltro,
      complejo: zonaFiltro ? { zona: zonaFiltro } : undefined,
    },
    include: {
      complejo: { include: { imagenes: { orderBy: { orden: 'asc' }, take: 1 } } },
    },
    orderBy: { nombre: 'asc' },
  })

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Buscar canchas</h1>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="zona" className="text-sm font-medium">
            Zona
          </label>
          <select
            id="zona"
            name="zona"
            defaultValue={zonaFiltro ?? ''}
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
            defaultValue={deporteFiltro ?? ''}
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

        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/80 h-9 rounded-lg px-4 text-sm font-medium"
        >
          Buscar
        </button>
      </form>

      {canchas.length === 0 ? (
        <div className="border-border mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed p-14 text-center">
          <SearchX className="text-muted-foreground size-8" />
          <h3 className="text-lg font-semibold">No encontramos canchas con esos filtros</h3>
          <p className="text-muted-foreground text-sm">Probá con otra zona o deporte.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {canchas.map((cancha) => (
            <Link
              key={cancha.id}
              href={`/jugador/complejos/${cancha.complejoId}`}
              className="border-border bg-card hover:bg-accent block rounded-2xl border p-5"
            >
              <span className="block font-semibold">{cancha.complejo.nombre}</span>
              <span className="text-muted-foreground block text-sm">{cancha.complejo.zona}</span>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1">
                  {deporteLabels[cancha.deporte]}
                </span>
                <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1">
                  {superficieLabels[cancha.tipoSuperficie]}
                </span>
              </div>
              <span className="text-primary mt-3 block text-lg font-bold">
                {formatPrecio(cancha.precioBase.toString())}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
