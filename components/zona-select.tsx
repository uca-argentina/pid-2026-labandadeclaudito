'use client'

import { useState, type ComponentPropsWithoutRef } from 'react'
import { cn } from 'cn'
import { MapPin } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { BARRIOS_CABA, LOCALIDADES_PBA, TODAS_LAS_ZONAS } from '@/lib/zonas'

type Provincia = 'CABA' | 'PBA'

function provinciaDeZona(zona: string): Provincia {
  return LOCALIDADES_PBA.includes(zona) ? 'PBA' : 'CABA'
}

const nativeSelectClassName =
  'h-11 w-full min-w-0 rounded-xl border border-input bg-background/50 px-3.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

// Select de zona del alta/edición de complejo: primero se elige la
// provincia (CABA o provincia de Buenos Aires) y después aparece la zona
// (barrio o localidad) de esa provincia. El valor que se manda y se guarda
// sigue siendo uno solo (ej: "Palermo"), igual que antes — la provincia es
// solo para elegir más fácil, no se guarda aparte. Siempre hay que elegir
// una zona (a diferencia del filtro de búsqueda, acá no existe "Todas").
export function ZonaSelect({
  defaultValue,
  className,
  ...props
}: { defaultValue: string } & ComponentPropsWithoutRef<'select'>) {
  const [provincia, setProvincia] = useState<Provincia>(
    defaultValue === '' ? 'CABA' : provinciaDeZona(defaultValue),
  )

  // Complejos creados antes de esta lista fija pueden tener una zona en texto
  // libre que no matchea ninguna opción: se agrega como opción extra para que
  // no se pierda en silencio al abrir el form de edición.
  const esValorFueraDeLista = defaultValue !== '' && !TODAS_LAS_ZONAS.includes(defaultValue)
  const zonaInicialDeEstaProvincia =
    provincia === provinciaDeZona(defaultValue || 'CABA') ? defaultValue : ''

  const opciones = provincia === 'CABA' ? BARRIOS_CABA : LOCALIDADES_PBA

  // Son 2 campos obligatorios separados (provincia y zona), con su propio
  // label cada uno: si quedaban los dos selects bajo un solo label "Zona"
  // de afuera no se entendía que había que elegir las dos cosas.
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="provincia" className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          Provincia *
        </Label>
        <select
          id="provincia"
          value={provincia}
          onChange={(e) => setProvincia(e.target.value as Provincia)}
          className={cn(nativeSelectClassName, className)}
        >
          <option value="CABA">CABA</option>
          <option value="PBA">Provincia de Buenos Aires</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={props.id} className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {provincia === 'CABA' ? 'Barrio' : 'Localidad'} *
        </Label>
        <select
          key={provincia}
          defaultValue={zonaInicialDeEstaProvincia}
          className={cn(nativeSelectClassName, className)}
          {...props}
        >
          <option value="" disabled>
            {provincia === 'CABA' ? 'Elegí un barrio' : 'Elegí una localidad'}
          </option>
          {esValorFueraDeLista && (
            <option value={defaultValue}>{defaultValue} (actual, elegí una de la lista)</option>
          )}
          {opciones.map((zona) => (
            <option key={zona} value={zona}>
              {zona}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
