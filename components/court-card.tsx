import { Clock } from 'lucide-react'
import type { CourtWithPrice } from '@/lib/court-search'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import { CourtBookingSheet } from '@/components/court-booking-sheet'
import { DibujoDeCancha } from '@/components/dibujo-de-cancha'

// Card de una cancha en el detalle del complejo. A la izquierda, una franja
// recortada en diagonal con un dibujo de la cancha según el deporte; a la
// derecha, los datos y el botón.
export function CourtCard({
  cancha,
  fechaInicial,
}: {
  cancha: CourtWithPrice
  fechaInicial?: string
}) {
  return (
    <div className="border-border bg-card relative min-h-39 overflow-hidden rounded-2xl border">
      <div className="absolute inset-y-0 left-0 w-25 opacity-75 [clip-path:polygon(0_0,58%_0,100%_100%,0_100%)] [mask-image:linear-gradient(90deg,black_40%,rgb(0_0_0/0.3)_100%)]">
        <DibujoDeCancha deporte={cancha.deporte} />
      </div>
      {/* Línea sobre el borde del recorte, mismos puntos que el clip-path */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="text-primary/50 absolute inset-y-0 left-0 h-full w-25"
      >
        <line
          x1="58"
          y1="0"
          x2="100"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Sin alto fijo: si el botón no entra al lado del precio (pantallas
          chicas), baja a otra línea y la card crece. min-h-31 = h-39 menos
          los márgenes de arriba y abajo. */}
      <div className="relative my-4 mr-5 ml-28 flex min-h-31 flex-col justify-between gap-3">
        <div className="min-w-0">
          <p className="text-primary truncate text-[11px] font-semibold tracking-wide uppercase">
            {deporteLabels[cancha.deporte]} · {superficieLabels[cancha.tipoSuperficie]}
          </p>
          <h3 className="truncate text-lg font-bold">{cancha.nombre}</h3>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Clock className="size-3.5 shrink-0" />
            {cancha.horaApertura} a {cancha.horaCierre} hs
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs">desde</p>
            <p className="text-primary text-xl font-bold">{formatPrecio(cancha.priceFrom)}</p>
            <p className="text-muted-foreground text-xs whitespace-nowrap">
              por turno de {cancha.duracionTurnoMin} min
            </p>
          </div>
          {/* ml-auto: si el botón baja de línea, queda a la derecha igual */}
          <div className="ml-auto">
            <CourtBookingSheet
              courtId={cancha.id}
              courtName={cancha.nombre}
              deporte={cancha.deporte}
              precioBase={cancha.precioBase.toString()}
              duracionTurnoMin={cancha.duracionTurnoMin}
              fechaInicial={fechaInicial}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
