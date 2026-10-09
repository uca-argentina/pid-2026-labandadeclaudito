import Image from 'next/image'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'
import { ImageIcon, MapPin, SearchX, Shapes, Wallet, X } from 'lucide-react'
import { formatPrecio } from '@/lib/labels'
import { activeFilterChips, filtersToQueryString, searchComplexes } from '@/lib/court-search'
import { searchCourtsSchema } from '@/lib/validations/court-search'
import { clasesGrillaAdaptable } from '@/lib/grid-columns'
import { deportesDistintos, precioMasBajo } from '@/lib/resumen-complejo'
import { bloqueosDelDia, resumenBloqueosDelComplejo } from '@/lib/blocks'
import { diaDeHoy } from '@/lib/time'
import { Button } from '@/components/ui/button'
import { SearchFiltersSheet } from '@/components/search-filters-sheet'
import { FiltrosDeBusqueda } from '@/components/filtros-de-busqueda'
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'
import { AvisoBloqueo } from '@/components/aviso-bloqueo'

export default async function BusquedaCanchasPage({ searchParams }: PageProps<'/jugador/canchas'>) {
  const session = await auth()
  if (!session) redirect('/login')

  const filtros = searchCourtsSchema.parse(await searchParams)

  const complejos = await searchComplexes(filtros, session.user.id)

  const filtrosAplicados = activeFilterChips(filtros)

  // Bloqueos del día buscado (o de hoy): un complejo con todas sus canchas
  // bloqueadas va en gris, y si son algunas se avisa cuántas.
  const idsDeCanchas: string[] = []
  for (const complejo of complejos) {
    for (const cancha of complejo.canchas) {
      idsDeCanchas.push(cancha.id)
    }
  }
  const bloqueos = await bloqueosDelDia(idsDeCanchas, new Date(filtros.fecha ?? diaDeHoy()))

  // En xl el botón "Filtros" se oculta: sin chips, la fila de arriba queda
  // vacía y los resultados suben para quedar alineados con los filtros.
  const margenResultados = filtrosAplicados.length === 0 ? 'mt-8 xl:mt-0' : 'mt-8'

  return (
    <main>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Buscar canchas</h1>
        <p className="text-muted-foreground mt-2">
          Filtrá por zona, deporte, superficie, precio, fecha y horario para encontrar una cancha.
        </p>
      </div>

      {/* En xl los filtros están siempre abiertos en una columna a la izquierda
          (todo el que entra a buscar filtra) y scrollean con la página; antes
          se abren desde el botón "Filtros" (sheet). */}
      <div className="grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="hidden xl:block">
          <div className="border-border bg-card rounded-2xl border px-5 pt-5">
            <h2 className="mb-5 font-semibold">Filtros</h2>
            <FiltrosDeBusqueda filtros={filtros} idPrefijo="lateral-" />
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-center gap-2">
            <SearchFiltersSheet filtros={filtros} cantidadDeFiltros={filtrosAplicados.length} />

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
            <div
              className={`border-border flex flex-col items-center gap-2.5 rounded-2xl border border-dashed p-16 text-center ${margenResultados}`}
            >
              <SearchX className="text-muted-foreground size-8" />
              <h3 className="text-lg font-semibold">No encontramos canchas con esos filtros</h3>
              <p className="text-muted-foreground text-sm">Probá aflojando algún filtro.</p>
            </div>
          ) : (
            <div className={`@container ${margenResultados}`}>
              <div className={`grid gap-5 ${clasesGrillaAdaptable(complejos.length)}`}>
                {complejos.map((complejo) => {
                  const deportes = deportesDistintos(complejo.canchas)
                  const precioMinimo = precioMasBajo(complejo.canchas)
                  let canchasBloqueadas = 0
                  for (const cancha of complejo.canchas) {
                    if (bloqueos.some((b) => b.courtId === cancha.id)) {
                      canchasBloqueadas++
                    }
                  }
                  const resumenBloqueos = resumenBloqueosDelComplejo(
                    canchasBloqueadas,
                    complejo.canchas.length,
                  )
                  const todasBloqueadas =
                    complejo.canchas.length > 0 && canchasBloqueadas === complejo.canchas.length

                  return (
                    <Link
                      key={complejo.id}
                      href={`/jugador/complejos/${complejo.id}${filtersToQueryString(filtros)}`}
                      className={`border-border bg-card hover:bg-accent flex h-full flex-col overflow-hidden rounded-2xl border transition-colors ${todasBloqueadas ? 'opacity-60 grayscale' : ''}`}
                    >
                      {complejo.imagenes.length > 0 ? (
                        <div className="relative aspect-video shrink-0">
                          <Image
                            src={complejo.imagenes[0].url}
                            alt={`Foto de ${complejo.nombre}`}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="bg-muted text-muted-foreground flex aspect-video shrink-0 flex-col items-center justify-center gap-1 text-sm">
                          <ImageIcon className="size-5" />
                          Sin fotos
                        </div>
                      )}

                      {/* flex-col + mt-auto en el footer de precio: así queda a la
                            misma altura en toda la fila, aunque el título o la
                            dirección ocupen distinta cantidad de líneas entre
                            tarjetas. El borde de arriba hace que ese espacio se vea
                            a propósito (un "pie" de tarjeta) y no como un hueco
                            vacío cuando el resto del contenido es corto. */}
                      <div className="flex flex-1 flex-col p-5">
                        <span className="block font-semibold">{complejo.nombre}</span>
                        <span className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                          <MapPin className="size-3.5 shrink-0" />
                          {complejo.direccion} · {complejo.zona}
                        </span>
                        {/* Misma forma que la dirección (ícono + texto): los íconos
                              quedan en columna y la cantidad no flota entre los chips
                              de deporte cuando saltan de línea. */}
                        <span className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                          <Shapes className="size-3.5 shrink-0" />
                          {complejo.canchas.length === 1
                            ? '1 cancha'
                            : `${complejo.canchas.length} canchas`}
                        </span>
                        {resumenBloqueos && (
                          <div className="mt-1.5">
                            <AvisoBloqueo texto={resumenBloqueos} />
                          </div>
                        )}

                        <div className="mt-3 mb-4 flex flex-wrap items-center gap-1.5">
                          {deportes.map((deporteDeCancha) => (
                            <EtiquetaDeporte key={deporteDeCancha} deporte={deporteDeCancha} />
                          ))}
                        </div>

                        <div className="border-border mt-auto flex items-center gap-1.5 border-t pt-3">
                          <Wallet className="text-primary size-4 shrink-0" />
                          <span className="text-muted-foreground text-xs">desde</span>
                          <span className="text-primary text-lg font-bold">
                            {precioMinimo === null ? '—' : formatPrecio(precioMinimo)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
