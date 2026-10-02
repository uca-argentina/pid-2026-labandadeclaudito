'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Search, SlidersHorizontal, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { diaDeHoy } from '@/lib/time'
import { SportSurfaceFilter } from '@/components/sport-surface-filter'
import { TimeRangeFilter } from '@/components/time-range-filter'
import { ZonaFilter } from '@/components/zona-filter'
import type { SearchCourtsFilters } from '@/lib/validations/court-search'

// Los filtros viven en un panel lateral que se abre encima de la página: al
// abrirlo o cerrarlo no se mueve nada de lo que hay detrás (las cards de los
// complejos no saltan), y entran todos los filtros que hagan falta.
export function SearchFiltersSheet({
  filtros,
  cantidadDeFiltros,
}: {
  filtros: SearchCourtsFilters
  cantidadDeFiltros: number
}) {
  const router = useRouter()
  // Los filtros guardan su valor en useState/defaultValue, que solo se leen al
  // montarse: cambiar la key fuerza a montarlos de nuevo. Cambia cuando llegan
  // filtros nuevos por URL y cada vez que se toca "Limpiar filtros" (aunque la
  // URL ya estuviera limpia y no haya navegación).
  const [vecesLimpiado, setVecesLimpiado] = useState(0)

  function limpiarFiltros() {
    setVecesLimpiado(vecesLimpiado + 1)
    router.push('/jugador/canchas')
  }

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        <SlidersHorizontal className="size-4" />
        Filtros
        {cantidadDeFiltros > 0 && <Badge>{cantidadDeFiltros}</Badge>}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md">
        <form
          key={`${JSON.stringify(filtros)}-${vecesLimpiado}`}
          method="get"
          className="flex min-h-0 flex-1 flex-col"
        >
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>Combiná los que quieras para encontrar tu cancha.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-8 overflow-y-auto px-4 pb-6">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold">Cancha</h3>

              <ZonaFilter zonaInicial={filtros.zona} />

              <SportSurfaceFilter
                deporteInicial={filtros.deporte}
                tipoSuperficieInicial={filtros.tipoSuperficie}
              />
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                <Wallet className="size-4" />
                Precio por turno
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precioMin">Mínimo</Label>
                  <Input
                    id="precioMin"
                    name="precioMin"
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Sin mínimo"
                    defaultValue={filtros.precioMin ?? ''}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precioMax">Máximo</Label>
                  <Input
                    id="precioMax"
                    name="precioMax"
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Sin máximo"
                    defaultValue={filtros.precioMax ?? ''}
                    className="h-10"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                <Calendar className="size-4" />
                Disponibilidad
              </h3>

              <div className="space-y-2">
                <Label htmlFor="fecha" className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  Fecha
                </Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  min={diaDeHoy()}
                  defaultValue={filtros.fecha ?? ''}
                  className="h-10"
                />
              </div>

              <TimeRangeFilter
                horaDesdeInicial={filtros.horaDesde}
                horaHastaInicial={filtros.horaHasta}
              />

              <p className="text-muted-foreground text-sm">
                El horario se aplica solo si elegís una fecha: se muestran las canchas con algún
                turno libre que empiece dentro de esa franja.
              </p>
            </section>
          </div>

          <SheetFooter className="border-border flex-row justify-end border-t">
            <Button type="button" variant="ghost" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
            <Button type="submit">
              <Search className="size-4" />
              Ver resultados
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
