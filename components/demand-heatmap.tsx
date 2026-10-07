'use client'

import { useState } from 'react'
import { Flame, Hash } from 'lucide-react'
import { nombresCortosDeDias } from '@/lib/labels'
import {
  franjasDelDia,
  horarioMasPedido,
  horariosDistintos,
  reservasEn,
  type CeldaDeDemanda,
} from '@/lib/dashboard'
import { Button } from '@/components/ui/button'

// Lunes primero, domingo al final, como se lee una semana en Argentina
const ordenDeDias = [1, 2, 3, 4, 5, 6, 0]

// Cuanto más se reserva un horario respecto del más pedido, más intenso el
// color del deporte
function claseDeIntensidad(reservas: number, maximo: number): string {
  if (reservas === 0 || maximo === 0) return 'bg-muted text-muted-foreground'

  const proporcion = reservas / maximo
  if (proporcion <= 0.25) return 'bg-acento/15 text-foreground'
  if (proporcion <= 0.5) return 'bg-acento/35 text-foreground'
  if (proporcion <= 0.75) return 'bg-acento/65 text-acento-foreground'
  return 'bg-acento text-acento-foreground'
}

function textoDeCelda(celda: CeldaDeDemanda): string {
  const palabra = celda.reservas === 1 ? 'reserva' : 'reservas'
  return `${nombresCortosDeDias[celda.diaSemana]} ${celda.horaInicio} · ${celda.reservas} ${palabra}`
}

// Mapa de calor día × hora. Pasar el mouse (o el foco de teclado) por una
// celda resalta su día y su hora y muestra el detalle arriba.
export function DemandHeatmap({ demanda }: { demanda: CeldaDeDemanda[] }) {
  const [celdaActiva, setCeldaActiva] = useState<CeldaDeDemanda | null>(null)
  const [mostrarNumeros, setMostrarNumeros] = useState(false)

  const horarios = horariosDistintos(demanda)
  const estrella = horarioMasPedido(demanda)

  if (estrella === null) {
    return (
      <p className="text-muted-foreground text-base">Todavía no hay reservas en este período.</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* La celda activa; si no hay ninguna, el horario pico */}
        <p
          className="bg-muted inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-base font-medium whitespace-nowrap"
          aria-live="polite"
        >
          {celdaActiva === null && (
            <Flame className="text-acento size-4 motion-safe:animate-pulse" />
          )}
          {textoDeCelda(celdaActiva ?? estrella)}
        </p>
        <Button
          variant="outline"
          aria-pressed={mostrarNumeros}
          onClick={() => setMostrarNumeros(!mostrarNumeros)}
        >
          <Hash className="size-4" />
          {mostrarNumeros ? 'Ocultar números' : 'Ver números'}
        </Button>
      </div>

      {/* En pantallas chicas la tabla es más ancha que la tarjeta: scrollea
          adentro. contain:inline-size hace que su ancho no estire la página. */}
      <div className="overflow-x-auto pb-1 [contain:inline-size]">
        <table className="mx-auto border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th />
              {franjasDelDia(demanda, horarios).map((franja) => (
                <th
                  key={franja.etiqueta}
                  colSpan={franja.columnas}
                  className="border-border text-muted-foreground border-b pb-1 text-left font-medium"
                >
                  {franja.etiqueta}
                </th>
              ))}
            </tr>
            <tr>
              <th className="sr-only">Día</th>
              {horarios.map((horario) => (
                <th
                  key={horario}
                  title={horario}
                  className={
                    celdaActiva?.horaInicio === horario
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground font-medium'
                  }
                >
                  {horario.slice(0, 2)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ordenDeDias.map((diaSemana, fila) => (
              <tr key={diaSemana}>
                <th
                  className={
                    celdaActiva?.diaSemana === diaSemana
                      ? 'text-foreground pr-2 text-left font-semibold'
                      : 'text-muted-foreground pr-2 text-left font-medium'
                  }
                >
                  {nombresCortosDeDias[diaSemana]}
                </th>

                {horarios.map((horaInicio, columna) => {
                  const celda = {
                    diaSemana,
                    horaInicio,
                    reservas: reservasEn(demanda, diaSemana, horaInicio),
                  }
                  const esEstrella =
                    diaSemana === estrella.diaSemana && horaInicio === estrella.horaInicio
                  const esActiva =
                    diaSemana === celdaActiva?.diaSemana && horaInicio === celdaActiva?.horaInicio

                  return (
                    <td key={horaInicio} className="p-0">
                      <button
                        type="button"
                        aria-label={textoDeCelda(celda)}
                        onMouseEnter={() => setCeldaActiva(celda)}
                        onMouseLeave={() => setCeldaActiva(null)}
                        onFocus={() => setCeldaActiva(celda)}
                        onBlur={() => setCeldaActiva(null)}
                        className={`flex size-10 items-center justify-center rounded-md font-medium transition-[background-color,scale] duration-500 hover:scale-110 focus-visible:scale-110 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-50 fill-mode-backwards ${claseDeIntensidad(celda.reservas, estrella.reservas)} ${esActiva ? 'ring-foreground ring-2' : ''}`}
                        // Entran en ola: de izquierda a derecha y de arriba hacia abajo
                        style={{
                          animationDelay: `${columna * 25 + fila * 15}ms`,
                          animationDuration: '400ms',
                        }}
                      >
                        {mostrarNumeros && celda.reservas}
                        {!mostrarNumeros && esEstrella && (
                          <Flame className="size-4 motion-safe:animate-pulse" />
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
        Menos
        <span className="bg-muted size-4 rounded" />
        <span className="bg-acento/15 size-4 rounded" />
        <span className="bg-acento/35 size-4 rounded" />
        <span className="bg-acento/65 size-4 rounded" />
        <span className="bg-acento size-4 rounded" />
        Más
      </div>
    </div>
  )
}
