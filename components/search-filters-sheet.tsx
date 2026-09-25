import Link from 'next/link'
import { Search, SlidersHorizontal } from 'lucide-react'
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
import { deporteLabels, superficieLabels } from '@/lib/labels'
import { diaDeHoy } from '@/lib/time'
import type { SearchCourtsFilters } from '@/lib/validations/court-search'

// Mismo aspecto que el Input de shadcn, para que los <select> nativos (que se
// mandan solos con el formulario GET) no desentonen.
const selectClassName =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus-visible:ring-3'

// Los filtros viven en un panel lateral que se abre encima de la página: al
// abrirlo o cerrarlo no se mueve nada de lo que hay detrás (las cards de los
// complejos no saltan), y entran todos los filtros que hagan falta.
export function SearchFiltersSheet({
  zonas,
  filtros,
  cantidadDeFiltros,
}: {
  zonas: string[]
  filtros: SearchCourtsFilters
  cantidadDeFiltros: number
}) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        <SlidersHorizontal className="size-4" />
        Filtros
        {cantidadDeFiltros > 0 && <Badge>{cantidadDeFiltros}</Badge>}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md">
        <form method="get" className="flex min-h-0 flex-1 flex-col">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>Combiná los que quieras para encontrar tu cancha.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-8 overflow-y-auto px-4 pb-6">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold">Cancha</h3>

              <div className="space-y-2">
                <Label htmlFor="zona">Zona</Label>
                <select
                  id="zona"
                  name="zona"
                  defaultValue={filtros.zona ?? ''}
                  className={selectClassName}
                >
                  <option value="">Todas</option>
                  {zonas.map((zona) => (
                    <option key={zona} value={zona}>
                      {zona}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deporte">Deporte</Label>
                <select
                  id="deporte"
                  name="deporte"
                  defaultValue={filtros.deporte ?? ''}
                  className={selectClassName}
                >
                  <option value="">Todos</option>
                  {Object.entries(deporteLabels).map(([valor, label]) => (
                    <option key={valor} value={valor}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoSuperficie">Superficie</Label>
                <select
                  id="tipoSuperficie"
                  name="tipoSuperficie"
                  defaultValue={filtros.tipoSuperficie ?? ''}
                  className={selectClassName}
                >
                  <option value="">Todas</option>
                  {Object.entries(superficieLabels).map(([valor, label]) => (
                    <option key={valor} value={valor}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold">Precio por turno</h3>

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
              <h3 className="text-sm font-semibold">Disponibilidad</h3>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  min={diaDeHoy()}
                  defaultValue={filtros.fecha ?? ''}
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horaDesde">Horario desde</Label>
                  <Input
                    id="horaDesde"
                    name="horaDesde"
                    type="time"
                    defaultValue={filtros.horaDesde ?? ''}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaHasta">Horario hasta</Label>
                  <Input
                    id="horaHasta"
                    name="horaHasta"
                    type="time"
                    defaultValue={filtros.horaHasta ?? ''}
                    className="h-10"
                  />
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                El horario se aplica solo si elegís una fecha: se muestran las canchas con algún
                turno libre que empiece dentro de esa franja.
              </p>
            </section>
          </div>

          <SheetFooter className="border-border flex-row justify-end border-t">
            <Button variant="ghost" render={<Link href="/jugador/canchas" />}>
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
