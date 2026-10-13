import { Building2, CalendarDays, Trophy, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deporteLabels } from '@/lib/labels'
import type { FiltrosDeReservas } from '@/lib/admin-bookings'

// Mismas clases que el Input de shadcn (como en zona-filter.tsx), con fondo de
// tarjeta como los filtros de Usuarios
const claseSelect =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-card h-11 w-full rounded-xl border px-3.5 text-base outline-none focus-visible:ring-3'

const deportes = ['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11', 'TENIS', 'PADEL', 'BASQUET'] as const

// Filtros de /admin/reservas. Es un formulario HTML común con method="get":
// al tocar "Filtrar" (o Enter en la búsqueda) el navegador arma la URL con los
// campos (?complejoId=...&deporte=...&jugador=...&desde=...&hasta=...) y la
// página la lee de searchParams. No hace falta JavaScript ni estado.
export function AdminBookingsFilters({
  complejos,
  filtros,
}: {
  complejos: { id: string; nombre: string; activo: boolean }[]
  filtros: FiltrosDeReservas
}) {
  return (
    <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
      {/* El estado se elige con las pestañas: se mantiene al cambiar el resto */}
      {filtros.estado !== undefined && <input type="hidden" name="estado" value={filtros.estado} />}

      <div className="grid w-full gap-1.5 sm:w-52">
        <Label htmlFor="complejoId" className="flex items-center gap-1.5">
          <Building2 className="size-3.5" />
          Complejo
        </Label>
        <select
          id="complejoId"
          name="complejoId"
          defaultValue={filtros.complejoId ?? ''}
          className={claseSelect}
        >
          <option value="">Todos los complejos</option>
          {complejos.map((complejo) => (
            <option key={complejo.id} value={complejo.id}>
              {complejo.activo ? complejo.nombre : `${complejo.nombre} (dado de baja)`}
            </option>
          ))}
        </select>
      </div>

      <div className="grid w-full gap-1.5 sm:w-36">
        <Label htmlFor="deporte" className="flex items-center gap-1.5">
          <Trophy className="size-3.5" />
          Deporte
        </Label>
        <select
          id="deporte"
          name="deporte"
          defaultValue={filtros.deporte ?? ''}
          className={claseSelect}
        >
          <option value="">Todos</option>
          {deportes.map((deporte) => (
            <option key={deporte} value={deporte}>
              {deporteLabels[deporte]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid w-full gap-1.5 sm:w-44">
        <Label htmlFor="jugador" className="flex items-center gap-1.5">
          <Search className="size-3.5" />
          Jugador
        </Label>
        <Input
          id="jugador"
          name="jugador"
          type="search"
          defaultValue={filtros.jugador ?? ''}
          placeholder="Nombre o email"
          maxLength={100}
          className="bg-card"
        />
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
          defaultValue={filtros.desde}
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
          defaultValue={filtros.hasta}
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
