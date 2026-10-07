'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ChevronDown } from 'lucide-react'
import { urlDelDashboard, type FiltrosDelDashboard } from '@/lib/dashboard'
import type { VistaDelSelector } from '@/lib/periodos'
import { PeriodPicker } from '@/components/period-picker'
import { Badge } from '@/components/ui/badge'

// Lo que hace falta para la barra del tiempo. Los filtros de cada botón (ir
// al anterior, al siguiente, a hoy, cambiar de vista) ya vienen armados de la
// página, que es la que sabe de fechas.
export type DatosDelPeriodo = {
  titulo: string
  subtitulo: string
  esElActual: boolean
  rango: { desde: string; hasta: string; hoy: string } | null
  anterior: FiltrosDelDashboard
  siguiente: FiltrosDelDashboard
  hoy: FiltrosDelDashboard
  porVista: Record<VistaDelSelector, FiltrosDelDashboard>
}

// La cabecera del dashboard y, abajo, el contenido (children):
// - el título con el complejo al lado: es el alcance de todo lo que se ve
// - la barra del tiempo (cuándo), que en pantallas grandes queda fija arriba
// El deporte se elige en el bloque principal, que es lo que cambia.
// Cambiar un filtro navega sin recargar la página (router.push): los números,
// el anillo y las barras pasan del valor viejo al nuevo con una transición.
// Mientras llegan los datos nuevos, el contenido se ve más tenue.
export function DashboardFrame({
  complejos,
  filtros,
  periodo,
  children,
}: {
  complejos: { id: string; nombre: string }[]
  filtros: FiltrosDelDashboard
  periodo: DatosDelPeriodo
  children: React.ReactNode
}) {
  const router = useRouter()
  const [cargando, startTransition] = useTransition()

  function navegar(nuevosFiltros: FiltrosDelDashboard) {
    startTransition(() => {
      router.push(urlDelDashboard(nuevosFiltros), { scroll: false })
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <h1 className="text-3xl font-semibold">Estadísticas</h1>
        {/* Selector de complejo con forma de botón: un select común con el
            ícono y la flecha dibujados encima */}
        {/* En mobile va en su propia fila (abajo del título), a todo el ancho */}
        <div className="relative order-last w-full sm:order-0 sm:w-auto">
          <Building2 className="text-acento pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          {/* key: si el complejo cambia desde otro lado (el ranking "Por
              complejo"), el select se vuelve a armar y muestra el nuevo */}
          <select
            key={filtros.complejoId ?? 'todos'}
            aria-label="Complejo"
            defaultValue={filtros.complejoId ?? ''}
            // Otro complejo puede no tener el deporte elegido: vuelve a "Todos".
            // El valor vacío es "Todos los complejos".
            onChange={(e) =>
              navegar({ ...filtros, complejoId: e.target.value || undefined, deporte: undefined })
            }
            className="border-input bg-card hover:bg-muted focus-visible:ring-ring/50 h-10 w-full max-w-full cursor-pointer appearance-none truncate rounded-full border pr-9 pl-9 text-base font-semibold shadow-sm transition-colors outline-none focus-visible:ring-3 sm:w-auto sm:max-w-72"
          >
            <option value="">Todos los complejos</option>
            {complejos.map((complejo) => (
              <option key={complejo.id} value={complejo.id}>
                {complejo.nombre}
              </option>
            ))}
          </select>
          <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
        </div>
        <Badge variant="outline">Datos de ejemplo</Badge>
      </div>

      <div className="bg-background/85 relative -mx-6 px-6 py-2 backdrop-blur-md md:sticky md:top-0 md:z-30">
        <PeriodPicker
          vista={filtros.vista}
          titulo={periodo.titulo}
          subtitulo={periodo.subtitulo}
          esElActual={periodo.esElActual}
          rango={periodo.rango}
          alIrAlAnterior={() => navegar(periodo.anterior)}
          alIrAlSiguiente={() => navegar(periodo.siguiente)}
          alVolverAHoy={() => navegar(periodo.hoy)}
          alCambiarLaVista={(vista) => navegar(periodo.porVista[vista])}
          alCambiarElRango={(desde, hasta) => navegar({ ...filtros, vista: 'rango', desde, hasta })}
        />
        {/* Mientras llegan los datos nuevos, una línea que corre por debajo */}
        {cargando && (
          <div className="absolute inset-x-6 bottom-0 h-0.5 overflow-hidden rounded-full">
            <div className="bg-acento h-full w-2/5 rounded-full motion-safe:animate-cargando" />
          </div>
        )}
      </div>

      <div
        aria-busy={cargando}
        className={cargando ? 'opacity-60 transition-opacity' : 'transition-opacity'}
      >
        {children}
      </div>
    </div>
  )
}
