'use client'

import { useState } from 'react'
import { Layers, Trophy } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { deporteLabels, superficieLabels, superficiesPorDeporte } from '@/lib/labels'
import type { Deporte, TipoSuperficie } from '@/lib/generated/prisma/client'

// Mismo aspecto que el Input de shadcn, para que los <select> nativos no desentonen
// (igual al de search-filters-sheet.tsx).
const selectClassName =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 bg-background/50 h-11 w-full rounded-xl border px-3.5 text-base outline-none focus-visible:ring-3'

// La superficie depende del deporte elegido: no tiene sentido ofrecer una
// combinación que no existe (ej: fútbol con polvo de ladrillo). Mismo mapa
// que usa el alta de canchas (lib/labels.ts, superficiesPorDeporte).
export function SportSurfaceFilter({
  deporteInicial,
  tipoSuperficieInicial,
  idPrefijo,
}: {
  deporteInicial?: Deporte
  tipoSuperficieInicial?: TipoSuperficie
  // Los filtros se dibujan dos veces (al costado y en el sheet del celular):
  // el prefijo evita ids repetidos, así cada label enfoca su propio campo.
  idPrefijo: string
}) {
  const [deporte, setDeporte] = useState<Deporte | ''>(deporteInicial ?? '')

  // Si todavía no se cambió el deporte, se respeta la superficie que venía en
  // la URL. Apenas se cambia el deporte, la superficie vuelve a "Todas"
  // (podría no tener sentido para el deporte nuevo).
  const superficiePorDefecto =
    deporte === (deporteInicial ?? '') ? (tipoSuperficieInicial ?? '') : ''

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefijo}deporte`} className="flex items-center gap-1.5">
          <Trophy className="size-3.5" />
          Deporte
        </Label>
        <select
          id={`${idPrefijo}deporte`}
          name="deporte"
          value={deporte}
          onChange={(e) => setDeporte(e.target.value as Deporte | '')}
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

      {/* La superficie solo tiene sentido elegirla después de elegir un
          deporte (sin deporte, "todas las superficies" no filtra nada
          coherente): se oculta hasta entonces. */}
      {deporte !== '' && (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefijo}tipoSuperficie`} className="flex items-center gap-1.5">
            <Layers className="size-3.5" />
            Superficie
          </Label>
          <select
            key={deporte}
            id={`${idPrefijo}tipoSuperficie`}
            name="tipoSuperficie"
            defaultValue={superficiePorDefecto}
            className={selectClassName}
          >
            <option value="">Todas</option>
            {superficiesPorDeporte[deporte].map((valor) => (
              <option key={valor} value={valor}>
                {superficieLabels[valor]}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  )
}
