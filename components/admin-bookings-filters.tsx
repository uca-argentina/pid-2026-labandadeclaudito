import { Building2, CalendarDays } from 'lucide-react'
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
    <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
      {/* El estado se elige con las pestañas: se mantiene al cambiar el resto */}
      {estado !== undefined && <input type="hidden" name="estado" value={estado} />}

      <div className="grid w-full gap-1.5 sm:w-64">
        <Label htmlFor="complejoId" className="flex items-center gap-1.5">
          <Building2 className="size-3.5" />
          Complejo
        </Label>
        <select
          id="complejoId"
          name="complejoId"
          defaultValue={complejoId ?? ''}
          // Las mismas clases que el Input de shadcn (como en zona-filter.tsx),
          // con fondo de tarjeta como los filtros de Usuarios
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-card h-11 w-full rounded-xl border px-3.5 text-base outline-none focus-visible:ring-3"
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
        <Label htmlFor="desde" className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          Desde
        </Label>
        <Input
          id="desde"
          name="desde"
          type="date"
          defaultValue={desde}
          required
          className="bg-card"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="hasta" className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          Hasta
        </Label>
        <Input
          id="hasta"
          name="hasta"
          type="date"
          defaultValue={hasta}
          required
          className="bg-card"
        />
      </div>

      {/* outline: en esta pantalla no hay una acción principal verde */}
      <Button type="submit" variant="outline">
        Filtrar
      </Button>
    </form>
  )
}
