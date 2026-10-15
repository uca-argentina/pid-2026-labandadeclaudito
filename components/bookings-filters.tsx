import Link from 'next/link'
import { Building2, CalendarDays, Trophy, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deporteLabels } from '@/lib/labels'
import type { Deporte } from '@/lib/generated/prisma/client'

// Mismas clases que el Input de shadcn (como en zona-filter.tsx), con fondo de
// tarjeta como los filtros de Usuarios
const claseSelect =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-card h-11 w-full rounded-xl border px-3.5 text-base outline-none focus-visible:ring-3'

const deportes = ['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11', 'TENIS', 'PADEL', 'BASQUET'] as const

// Filtros de las pantallas de reservas del admin y del dueño. Es un formulario
// HTML común con method="get": al tocar "Filtrar" (o Enter en la búsqueda) el
// navegador arma la URL con los campos (?complejoId=...&deporte=...&jugador=...
// &desde=...&hasta=...) y la página la lee de searchParams. No hace falta
// JavaScript ni estado.
// - campoOculto: lo que se elige afuera del formulario (la pestaña) y se tiene
//   que mantener al filtrar. El admin manda el estado; el dueño, la vista.
// - fechasObligatorias: el admin siempre mira un período; el dueño puede dejar
//   las fechas vacías y ver todo.
// - urlSinFiltros: si viene, aparece "Limpiar" al lado de Filtrar.
export function BookingsFilters({
  complejos,
  filtros,
  campoOculto,
  fechasObligatorias,
  urlSinFiltros,
}: {
  complejos: { id: string; nombre: string; activo: boolean }[]
  filtros: {
    complejoId?: string
    deporte?: Deporte
    jugador?: string
    desde?: string
    hasta?: string
  }
  campoOculto?: { nombre: string; valor: string }
  fechasObligatorias: boolean
  urlSinFiltros?: string
}) {
  return (
    <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
      {campoOculto !== undefined && (
        <input type="hidden" name={campoOculto.nombre} value={campoOculto.valor} />
      )}

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

      {/* En celular, Desde y Hasta comparten la fila (mitad cada uno) */}
      <div className="grid min-w-0 flex-1 gap-1.5 sm:flex-none">
        <Label htmlFor="desde" className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          Desde
        </Label>
        <Input
          id="desde"
          name="desde"
          type="date"
          defaultValue={filtros.desde ?? ''}
          required={fechasObligatorias}
          className="bg-card"
        />
      </div>

      <div className="grid min-w-0 flex-1 gap-1.5 sm:flex-none">
        <Label htmlFor="hasta" className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          Hasta
        </Label>
        <Input
          id="hasta"
          name="hasta"
          type="date"
          defaultValue={filtros.hasta ?? ''}
          required={fechasObligatorias}
          className="bg-card"
        />
      </div>

      <div className="flex gap-2">
        {/* outline: en estas pantallas no hay una acción principal verde */}
        <Button type="submit" variant="outline">
          Filtrar
        </Button>
        {urlSinFiltros !== undefined && (
          <Button variant="ghost" render={<Link href={urlSinFiltros} />}>
            Limpiar
          </Button>
        )}
      </div>
    </form>
  )
}
