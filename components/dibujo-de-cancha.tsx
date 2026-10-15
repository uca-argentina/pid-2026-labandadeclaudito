import type { Deporte } from '@/lib/generated/prisma/client'

// Cancha vista desde arriba, a lo largo. Los colores van fijos en el SVG
// (son el color real de cada superficie, no cambian con el tema). La usan la
// card de la cancha y el encabezado del sheet de reserva.
export function DibujoDeCancha({ deporte }: { deporte: Deporte }) {
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
