import type { Deporte } from '@/lib/generated/prisma/client'

// La cancha entera, acostada y en chiquito, para listas y tablas. Es un dibujo
// aparte del de DibujoDeCancha porque achicar ese dejaba las líneas demasiado
// finas: acá hay menos detalle y las líneas son más gruesas. Los colores son
// los mismos (el color real de cada superficie, no cambian con el tema).
// El tamaño lo pone quien la usa (className), siempre en proporción 16:10.
export function MiniCancha({ deporte, className }: { deporte: Deporte; className: string }) {
  return (
    <div
      aria-hidden
      className={`relative shrink-0 overflow-hidden shadow-sm ring-1 ring-black/15 ${className}`}
    >
      <DibujoChico deporte={deporte} />
      {/* Brillo de arriba hacia abajo: le da volumen, como una foto */}
      <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent" />
    </div>
  )
}

function DibujoChico({ deporte }: { deporte: Deporte }) {
  switch (deporte) {
    case 'FUTBOL_5':
    case 'FUTBOL_7':
    case 'FUTBOL_11':
      return (
        <svg viewBox="0 0 64 40" className="size-full">
          <rect width="64" height="40" fill="#3f8a4a" />
          {/* Franjas del césped cortado */}
          <rect x="8" width="8" height="40" fill="#4a9655" />
          <rect x="24" width="8" height="40" fill="#4a9655" />
          <rect x="40" width="8" height="40" fill="#4a9655" />
          <rect x="56" width="8" height="40" fill="#4a9655" />
          <g fill="none" stroke="#ffffff" strokeWidth="1.4">
            <rect x="4" y="4" width="56" height="32" />
            <line x1="32" y1="4" x2="32" y2="36" />
            <circle cx="32" cy="20" r="5.5" />
            <rect x="4" y="12" width="8" height="16" />
            <rect x="52" y="12" width="8" height="16" />
          </g>
          {/* Arcos, del lado de afuera de la línea de fondo */}
          <rect x="1.5" y="16.5" width="2.5" height="7" fill="#ffffff" />
          <rect x="60" y="16.5" width="2.5" height="7" fill="#ffffff" />
          <circle cx="32" cy="20" r="1.2" fill="#ffffff" />
        </svg>
      )
    case 'PADEL':
      return (
        <svg viewBox="0 0 64 40" className="size-full">
          <rect width="64" height="40" fill="#3b6fb0" />
          <g fill="none" stroke="#ffffff" strokeWidth="1.4">
            <rect x="4" y="4" width="56" height="32" />
            {/* Líneas de saque y la del medio */}
            <line x1="13" y1="4" x2="13" y2="36" />
            <line x1="51" y1="4" x2="51" y2="36" />
            <line x1="13" y1="20" x2="51" y2="20" />
          </g>
          {/* La red, más gruesa y pasando un poco las líneas */}
          <line x1="32" y1="2" x2="32" y2="38" stroke="#ffffff" strokeWidth="2.6" />
        </svg>
      )
    case 'TENIS':
      return (
        <svg viewBox="0 0 64 40" className="size-full">
          <rect width="64" height="40" fill="#c8643c" />
          <g fill="none" stroke="#f3e6d0" strokeWidth="1.4">
            <rect x="4" y="4" width="56" height="32" />
            {/* Pasillos de dobles */}
            <line x1="4" y1="8.5" x2="60" y2="8.5" />
            <line x1="4" y1="31.5" x2="60" y2="31.5" />
            {/* Cuadros de saque */}
            <line x1="17" y1="8.5" x2="17" y2="31.5" />
            <line x1="47" y1="8.5" x2="47" y2="31.5" />
            <line x1="17" y1="20" x2="47" y2="20" />
          </g>
          <line x1="32" y1="2" x2="32" y2="38" stroke="#f3e6d0" strokeWidth="2.6" />
        </svg>
      )
    case 'BASQUET':
      return (
        <svg viewBox="0 0 64 40" className="size-full">
          <rect width="64" height="40" fill="#c9965a" />
          {/* Tablones del parquet */}
          <g stroke="#b9854c" strokeWidth="0.6">
            <line x1="0" y1="10" x2="64" y2="10" />
            <line x1="0" y1="20" x2="64" y2="20" />
            <line x1="0" y1="30" x2="64" y2="30" />
          </g>
          {/* Las dos zonas pintadas */}
          <rect x="4" y="14" width="11" height="12" fill="#b0663a" />
          <rect x="49" y="14" width="11" height="12" fill="#b0663a" />
          <g fill="none" stroke="#ffffff" strokeWidth="1.4">
            <rect x="4" y="4" width="56" height="32" />
            <line x1="32" y1="4" x2="32" y2="36" />
            <circle cx="32" cy="20" r="5" />
            <rect x="4" y="14" width="11" height="12" />
            <rect x="49" y="14" width="11" height="12" />
            {/* Líneas de triple: medio círculo desde cada aro */}
            <path d="M4 7 A13 13 0 0 1 4 33" />
            <path d="M60 7 A13 13 0 0 0 60 33" />
          </g>
        </svg>
      )
  }
}
