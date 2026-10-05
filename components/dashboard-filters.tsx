'use client'

import { Label } from '@/components/ui/label'

// Mismo aspecto que el Input de shadcn (igual al de zona-filter.tsx)
const selectClassName =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus-visible:ring-3'

// Formulario GET común: al cambiar un select se envía solo y la página se
// vuelve a cargar con ?complejoId=...&dias=... en la URL.
export function DashboardFilters({
  complejos,
  complejoId,
  dias,
}: {
  complejos: { id: string; nombre: string }[]
  complejoId: string
  dias: number
}) {
  return (
    <form method="get" className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="complejoId">Complejo</Label>
        <select
          id="complejoId"
          name="complejoId"
          defaultValue={complejoId}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className={selectClassName}
        >
          {complejos.map((complejo) => (
            <option key={complejo.id} value={complejo.id}>
              {complejo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dias">Período</Label>
        <select
          id="dias"
          name="dias"
          defaultValue={String(dias)}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className={selectClassName}
        >
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
        </select>
      </div>
    </form>
  )
}
