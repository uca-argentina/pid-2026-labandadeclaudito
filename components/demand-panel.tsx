'use client'

import { useState } from 'react'
import { CalendarDays, ChartSpline, Grid3x3 } from 'lucide-react'
import {
  horariosDistintos,
  reservasPorDia,
  reservasPorHorario,
  type CeldaDeDemanda,
} from '@/lib/dashboard'
import { claseTarjetaDeDatos } from '@/components/data-card'
import { DemandCurve } from '@/components/demand-curve'
import { DemandHeatmap } from '@/components/demand-heatmap'
import { WeekStrip } from '@/components/week-strip'

export type VistaDeDemanda = 'hora' | 'dia' | 'semana'

const claseOpcion =
  'inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-base font-medium whitespace-nowrap transition-colors sm:flex-none'

function Opcion({
  vista,
  vistaActual,
  elegir,
  icono: Icono,
  texto,
}: {
  vista: VistaDeDemanda
  vistaActual: VistaDeDemanda
  elegir: (vista: VistaDeDemanda) => void
  icono: typeof ChartSpline
  texto: string
}) {
  const activa = vista === vistaActual
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={() => elegir(vista)}
      className={
        activa
          ? `${claseOpcion} bg-card text-acento shadow-sm`
          : `${claseOpcion} text-muted-foreground hover:text-foreground`
      }
    >
      <Icono className="hidden size-4 sm:block" />
      {texto}
    </button>
  )
}

// Cuándo se llenan las canchas, en una sola tarjeta con hasta tres vistas:
// - por hora: la curva del día, este período contra el anterior
// - por día: qué días de la semana se reserva más (desde una semana)
// - semana: el mapa día × hora, para encontrar huecos puntuales (en un mes)
// Mirando un solo día, las vistas por día no dicen nada: no se ofrecen.
export function DemandPanel({
  demanda,
  demandaAnterior,
  vistasDisponibles,
  nombreDelAnterior,
}: {
  demanda: CeldaDeDemanda[]
  demandaAnterior: CeldaDeDemanda[]
  vistasDisponibles: VistaDeDemanda[]
  nombreDelAnterior: string
}) {
  const [vistaElegida, setVistaElegida] = useState<VistaDeDemanda>('hora')
  // Si se cambia a un período más corto, la vista elegida puede no estar más
  const vista = vistasDisponibles.includes(vistaElegida) ? vistaElegida : 'hora'

  const horarios = horariosDistintos(demanda)

  return (
    <section className={`${claseTarjetaDeDatos} p-6`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold whitespace-nowrap">Demanda</h2>
        {/* Con una sola vista no hay nada que elegir. En mobile ocupa todo el
            ancho y sin íconos, para que entren las tres */}
        {vistasDisponibles.length > 1 && (
          <div
            className="bg-muted flex w-full rounded-lg p-1 sm:w-auto"
            role="group"
            aria-label="Vista"
          >
            <Opcion
              vista="hora"
              vistaActual={vista}
              elegir={setVistaElegida}
              icono={ChartSpline}
              texto="Por hora"
            />
            <Opcion
              vista="dia"
              vistaActual={vista}
              elegir={setVistaElegida}
              icono={CalendarDays}
              texto="Por día"
            />
            {vistasDisponibles.includes('semana') && (
              <Opcion
                vista="semana"
                vistaActual={vista}
                elegir={setVistaElegida}
                icono={Grid3x3}
                texto="Semana"
              />
            )}
          </div>
        )}
      </div>

      {vista === 'hora' && (
        <div className="space-y-4">
          <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span className="bg-acento h-1 w-5 rounded-full" />
              Este período
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span className="bg-muted-foreground/60 h-0.5 w-5 rounded-full" />
              {nombreDelAnterior}
            </span>
          </div>
          <DemandCurve
            horarios={horarios}
            actual={reservasPorHorario(demanda, horarios)}
            anterior={reservasPorHorario(demandaAnterior, horarios)}
          />
        </div>
      )}
      {vista === 'dia' && <WeekStrip totalesPorDia={reservasPorDia(demanda)} />}
      {vista === 'semana' && <DemandHeatmap demanda={demanda} />}
    </section>
  )
}
