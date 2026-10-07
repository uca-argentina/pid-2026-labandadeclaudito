'use client'

import { useState } from 'react'
import { ChartSpline, Grid3x3 } from 'lucide-react'
import { horariosDistintos, reservasPorHorario, type CeldaDeDemanda } from '@/lib/dashboard'
import { DemandCurve } from '@/components/demand-curve'
import { DemandHeatmap } from '@/components/demand-heatmap'

const claseOpcion =
  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-base font-medium whitespace-nowrap transition-colors'

// Una sola tarjeta para la demanda, con dos vistas: la curva por hora (este
// período contra el anterior) o el mapa de la semana (día × hora).
export function DemandPanel({
  demanda,
  demandaAnterior,
}: {
  demanda: CeldaDeDemanda[]
  demandaAnterior: CeldaDeDemanda[]
}) {
  const [vista, setVista] = useState<'curva' | 'mapa'>('curva')

  const horarios = horariosDistintos(demanda)

  return (
    <section className="border-border bg-card rounded-2xl border p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold whitespace-nowrap">Demanda por horario</h2>
        <div className="bg-muted inline-flex rounded-lg p-1" role="group" aria-label="Vista">
          <button
            type="button"
            aria-pressed={vista === 'curva'}
            onClick={() => setVista('curva')}
            className={
              vista === 'curva'
                ? `${claseOpcion} bg-card shadow-sm`
                : `${claseOpcion} text-muted-foreground hover:text-foreground`
            }
          >
            <ChartSpline className="size-4" />
            Por hora
          </button>
          <button
            type="button"
            aria-pressed={vista === 'mapa'}
            onClick={() => setVista('mapa')}
            className={
              vista === 'mapa'
                ? `${claseOpcion} bg-card shadow-sm`
                : `${claseOpcion} text-muted-foreground hover:text-foreground`
            }
          >
            <Grid3x3 className="size-4" />
            Semana
          </button>
        </div>
      </div>

      {vista === 'curva' ? (
        <div className="space-y-4">
          <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span className="bg-acento h-1 w-5 rounded-full" />
              Este período
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span className="bg-muted-foreground/60 h-0.5 w-5 rounded-full" />
              Período anterior
            </span>
          </div>
          <DemandCurve
            horarios={horarios}
            actual={reservasPorHorario(demanda, horarios)}
            anterior={reservasPorHorario(demandaAnterior, horarios)}
          />
        </div>
      ) : (
        <DemandHeatmap demanda={demanda} />
      )}
    </section>
  )
}
