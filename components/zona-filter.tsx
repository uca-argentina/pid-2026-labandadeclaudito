'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { BARRIOS_CABA, LOCALIDADES_PBA, TODAS_LAS_ZONAS } from '@/lib/zonas'

type Provincia = '' | 'CABA' | 'PBA'

function provinciaDeZona(zona: string): Provincia {
  if (!TODAS_LAS_ZONAS.includes(zona)) return ''
  return LOCALIDADES_PBA.includes(zona) ? 'PBA' : 'CABA'
}

// Mismo aspecto que el Input de shadcn, para que los <select> nativos no desentonen
// (igual al de search-filters-sheet.tsx).
const selectClassName =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-background/50 h-11 w-full rounded-xl border px-3.5 text-base outline-none focus-visible:ring-3'

// Filtro de zona del buscador: arranca en "Todas" (como el de Deporte) y
// recién cuando se elige una provincia aparece "Zona" con los barrios o
// localidades de esa provincia. Antes de elegir provincia no tiene sentido
// mostrar una lista de zonas, así que ese segundo select ni se muestra.
export function ZonaFilter({
  zonaInicial,
  idPrefijo,
}: {
  zonaInicial?: string
  // Los filtros se dibujan dos veces (al costado y en el sheet del celular):
  // el prefijo evita ids repetidos, así cada label enfoca su propio campo.
  idPrefijo: string
}) {
  const [provincia, setProvincia] = useState<Provincia>(
    zonaInicial === undefined ? '' : provinciaDeZona(zonaInicial),
  )

  const opciones = provincia === 'CABA' ? BARRIOS_CABA : provincia === 'PBA' ? LOCALIDADES_PBA : []

  // Si todavía no se cambió la provincia, se respeta la zona que venía en la
  // URL. Apenas se cambia la provincia, la zona vuelve a "Todas".
  const zonaPorDefecto =
    provincia === (zonaInicial === undefined ? '' : provinciaDeZona(zonaInicial))
      ? (zonaInicial ?? '')
      : ''

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefijo}provincia`} className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          Provincia
        </Label>
        <select
          id={`${idPrefijo}provincia`}
          value={provincia}
          onChange={(e) => setProvincia(e.target.value as Provincia)}
          className={selectClassName}
        >
          <option value="">Todas</option>
          <option value="CABA">CABA</option>
          <option value="PBA">Provincia de Buenos Aires</option>
        </select>
      </div>

      {provincia !== '' && (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefijo}zona`} className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            Zona
          </Label>
          <select
            key={provincia}
            id={`${idPrefijo}zona`}
            name="zona"
            defaultValue={zonaPorDefecto}
            className={selectClassName}
          >
            <option value="">Todas</option>
            {opciones.map((zona) => (
              <option key={zona} value={zona}>
                {zona}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  )
}
