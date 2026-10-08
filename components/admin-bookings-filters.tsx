import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GrupoDeEstado } from '@/lib/admin-bookings'

// Filtros de /admin/reservas. Es un formulario HTML común con method="get":
// al tocar "Filtrar" el navegador arma la URL con los campos
// (?complejoId=...&desde=...&hasta=...) y la página la lee de searchParams.
// No hace falta JavaScript ni estado.
export function AdminBookingsFilters({
  complejos,
  complejoId,
  desde,
  hasta,
  estado,
}: {
  complejos: { id: string; nombre: string; activo: boolean }[]
  complejoId: string | undefined
  desde: string
  hasta: string
  estado: GrupoDeEstado | undefined
}) {
  return (
    <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
      {/* El estado se elige con las tarjetas: se mantiene al cambiar el resto */}
      {estado !== undefined && <input type="hidden" name="estado" value={estado} />}

      <div className="grid w-full gap-1.5 sm:w-64">
        <Label htmlFor="complejoId">Complejo</Label>
        <select
          id="complejoId"
          name="complejoId"
          defaultValue={complejoId ?? ''}
          // Las mismas clases que el Input de shadcn, para que se vean iguales
          className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border bg-transparent px-2.5 text-base outline-none focus-visible:ring-3 md:text-sm"
        >
          <option value="">Todos los complejos</option>
          {complejos.map((complejo) => (
            <option key={complejo.id} value={complejo.id}>
              {complejo.activo ? complejo.nombre : `${complejo.nombre} (dado de baja)`}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="desde">Desde</Label>
        <Input id="desde" name="desde" type="date" defaultValue={desde} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="hasta">Hasta</Label>
        <Input id="hasta" name="hasta" type="date" defaultValue={hasta} required />
      </div>

      <Button type="submit">Filtrar</Button>
    </form>
  )
}
