import type { Deporte } from '@/lib/generated/prisma/client'
import { PelotaDeBasquet, PelotaDeFutbol, PelotaDeTenis } from '@/components/sport-ball'

// Un ícono distinto por deporte (chips, listas). Los tres fútbol comparten la
// pelota y se distinguen por el número; tenis y pádel, por la raqueta.
// Dibujados en un cuadrado de 24 × 24.

function PelotaConNumero({ numero }: { numero: string }) {
  return (
    <>
      <PelotaDeFutbol x={10.5} y={10.5} r={9.5} />
      <circle cx="18.5" cy="18.5" r="5.5" className="fill-foreground stroke-card" strokeWidth="1" />
      <text
        x="18.5"
        y="21"
        textAnchor="middle"
        fontSize={numero.length > 1 ? 6.5 : 7.5}
        fontWeight="700"
        className="fill-background"
      >
        {numero}
      </text>
    </>
  )
}

// Raqueta de tenis: marco rojo y ovalado, encordado, garganta en V y
// empuñadura (así no se confunde con una lupa)
function RaquetaDeTenis() {
  return (
    <>
      <g transform="rotate(-40 12 12)">
        <ellipse cx="12" cy="7.5" rx="5" ry="6.8" className="fill-hero-line" />
        <path
          d="M10 1.8V13.2 M12 0.9V14.1 M14 1.8V13.2 M7.6 5H16.4 M7.1 7.5H16.9 M7.6 10H16.4"
          strokeWidth="0.55"
          className="stroke-hero-ink/40"
        />
        <ellipse
          cx="12"
          cy="7.5"
          rx="5"
          ry="6.8"
          strokeWidth="1.8"
          className="stroke-hero-team-red fill-none"
        />
        {/* Garganta: dos varillas que se juntan en el mango */}
        <path
          d="M9.5 13.2 L12 17 L14.5 13.2"
          strokeWidth="1.4"
          className="stroke-hero-team-red fill-none"
        />
        <rect x="10.8" y="16.5" width="2.4" height="7" rx="1" className="fill-hero-ink" />
      </g>
      <PelotaDeTenis x={19.5} y={19} r={3.8} />
    </>
  )
}

function PaletaDePadel() {
  const agujeros = [
    [10, 5.5],
    [14, 5.5],
    [8.5, 8.5],
    [12, 8.5],
    [15.5, 8.5],
    [10, 11.5],
    [14, 11.5],
  ]
  return (
    <>
      <g transform="rotate(-35 12 12)">
        {/* Paleta: cara llena con agujeros y mango corto */}
        <circle cx="12" cy="8.5" r="6.5" className="fill-hero-padel" />
        {agujeros.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.8" className="fill-hero-line/80" />
        ))}
        <rect x="10.8" y="14.5" width="2.4" height="8" rx="1.2" className="fill-foreground" />
      </g>
      <PelotaDeTenis x={19} y={18.5} r={4} />
    </>
  )
}

export function SportIcon({ deporte, className }: { deporte: Deporte; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`shrink-0 overflow-visible ${className}`}
    >
      {deporte === 'FUTBOL_5' && <PelotaConNumero numero="5" />}
      {deporte === 'FUTBOL_7' && <PelotaConNumero numero="7" />}
      {deporte === 'FUTBOL_11' && <PelotaConNumero numero="11" />}
      {deporte === 'TENIS' && <RaquetaDeTenis />}
      {deporte === 'PADEL' && <PaletaDePadel />}
      {deporte === 'BASQUET' && <PelotaDeBasquet x={12} y={12} r={10} />}
    </svg>
  )
}
