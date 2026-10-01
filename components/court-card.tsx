import Image from 'next/image'
import { Clock } from 'lucide-react'
import type { Cancha, Deporte } from '@/lib/generated/prisma/client'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import { CourtBookingSheet } from '@/components/court-booking-sheet'

// Card de una cancha en el detalle del complejo. A la izquierda, una franja
// recortada en diagonal con la foto del complejo (o, si no tiene fotos, un
// dibujo de la cancha según el deporte); a la derecha, los datos y el botón.
export function CourtCard({
  cancha,
  fotoUrl,
  fechaInicial,
}: {
  cancha: Cancha
  fotoUrl?: string
  fechaInicial?: string
}) {
  return (
    <div className="border-border bg-card relative h-39 overflow-hidden rounded-2xl border">
      <div className="absolute inset-y-0 left-0 w-25 opacity-75 [clip-path:polygon(0_0,58%_0,100%_100%,0_100%)] [mask-image:linear-gradient(90deg,black_40%,rgb(0_0_0/0.3)_100%)]">
        {fotoUrl ? (
          <Image src={fotoUrl} alt="" fill sizes="100px" className="object-cover" />
        ) : (
          <CourtIllustration deporte={cancha.deporte} />
        )}
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

      <div className="absolute top-4 right-5 bottom-4 left-28 flex flex-col justify-between">
        <div>
          <p className="text-primary truncate text-[11px] font-semibold tracking-wide uppercase">
            {deporteLabels[cancha.deporte]} · {superficieLabels[cancha.tipoSuperficie]}
          </p>
          <h3 className="truncate text-lg font-bold">{cancha.nombre}</h3>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Clock className="size-3.5 shrink-0" />
            {cancha.horaApertura} a {cancha.horaCierre} hs
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-primary text-xl font-bold">
              {formatPrecio(cancha.precioBase.toString())}
            </p>
            <p className="text-muted-foreground text-xs whitespace-nowrap">
              por turno de {cancha.duracionTurnoMin} min
            </p>
          </div>
          <CourtBookingSheet
            courtId={cancha.id}
            courtName={cancha.nombre}
            courtSportLabel={deporteLabels[cancha.deporte]}
            precioBase={cancha.precioBase.toString()}
            duracionTurnoMin={cancha.duracionTurnoMin}
            fechaInicial={fechaInicial}
          />
        </div>
      </div>
    </div>
  )
}

// Cancha vista desde arriba, a lo largo. Los colores van fijos en el SVG
// (son el color real de cada superficie, no cambian con el tema).
function CourtIllustration({ deporte }: { deporte: Deporte }) {
  switch (deporte) {
    case 'FUTBOL_5':
    case 'FUTBOL_7':
    case 'FUTBOL_11':
      return (
        <svg
          aria-hidden
          viewBox="0 0 100 156"
          preserveAspectRatio="xMidYMid slice"
          className="size-full"
        >
          <rect width="100" height="156" fill="#3f8a4a" />
          <rect y="0" width="100" height="19.5" fill="#4a9655" />
          <rect y="39" width="100" height="19.5" fill="#4a9655" />
          <rect y="78" width="100" height="19.5" fill="#4a9655" />
          <rect y="117" width="100" height="19.5" fill="#4a9655" />
          <g fill="none" stroke="#ffffff" strokeWidth="1.5">
            <rect x="10" y="10" width="80" height="136" />
            <line x1="10" y1="78" x2="90" y2="78" />
            <circle cx="50" cy="78" r="14" />
            <rect x="28" y="10" width="44" height="22" />
            <rect x="40" y="10" width="20" height="8" />
            <rect x="28" y="124" width="44" height="22" />
            <rect x="40" y="138" width="20" height="8" />
          </g>
        </svg>
      )
    case 'PADEL':
      return (
        <svg
          aria-hidden
          viewBox="0 0 100 156"
          preserveAspectRatio="xMidYMid slice"
          className="size-full"
        >
          <rect width="100" height="156" fill="#3b6fb0" />
          <g fill="none" stroke="#ffffff" strokeWidth="1.5">
            <rect x="12" y="10" width="76" height="136" />
            <line x1="12" y1="31" x2="88" y2="31" />
            <line x1="12" y1="125" x2="88" y2="125" />
            <line x1="50" y1="31" x2="50" y2="125" />
          </g>
          <line x1="8" y1="78" x2="92" y2="78" stroke="#ffffff" strokeWidth="3" />
        </svg>
      )
    case 'TENIS':
      return (
        <svg
          aria-hidden
          viewBox="0 0 100 156"
          preserveAspectRatio="xMidYMid slice"
          className="size-full"
        >
          <rect width="100" height="156" fill="#c8643c" />
          <g fill="none" stroke="#f3e6d0" strokeWidth="1.5">
            <rect x="10" y="10" width="80" height="136" />
            <line x1="20" y1="10" x2="20" y2="146" />
            <line x1="80" y1="10" x2="80" y2="146" />
            <line x1="20" y1="41" x2="80" y2="41" />
            <line x1="20" y1="115" x2="80" y2="115" />
            <line x1="50" y1="41" x2="50" y2="115" />
          </g>
          <line x1="6" y1="78" x2="94" y2="78" stroke="#f3e6d0" strokeWidth="3" />
        </svg>
      )
    case 'BASQUET':
      return (
        <svg
          aria-hidden
          viewBox="0 0 100 156"
          preserveAspectRatio="xMidYMid slice"
          className="size-full"
        >
          <rect width="100" height="156" fill="#c9965a" />
          <g fill="none" stroke="#ffffff" strokeWidth="1.5">
            <rect x="10" y="10" width="80" height="136" />
            <line x1="10" y1="78" x2="90" y2="78" />
            <circle cx="50" cy="78" r="12" />
            <rect x="36" y="10" width="28" height="30" />
            <rect x="36" y="116" width="28" height="30" />
          </g>
        </svg>
      )
  }
}
