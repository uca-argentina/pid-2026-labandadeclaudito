import { familiaDelDeporte } from '@/lib/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'

// Las pelotas de cada deporte, dibujadas con radio 10 y escaladas a r. Mismo
// dibujo que las escenas del login. Se usan sueltas (SportBall, como ícono) o
// adentro de la ilustración de la cancha (los <g> de abajo).
type Pelota = { x: number; y: number; r: number }

export function PelotaDeFutbol({ x, y, r }: Pelota) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r / 10})`}>
      <circle r="10" strokeWidth="0.8" className="stroke-hero-ink fill-hero-line" />
      <path
        d="M0 -4L3.8 -1.2L2.4 3.2L-2.4 3.2L-3.8 -1.2Z M-3.9 -9.2L-2.6 -8.4L0 -7.4L2.6 -8.4L3.9 -9.2A10 10 0 0 0 -3.9 -9.2Z M7.5 -6.6L7.2 -5L7 -2.3L8.8 0.2L10 0.9A10 10 0 0 0 7.5 -6.6Z M8.6 5.2L7 5.3L4.3 6L2.9 8.3L2.2 9.7A10 10 0 0 0 8.6 5.2Z M-2.2 9.7L-2.9 8.3L-4.3 6L-7 5.3L-8.6 5.2A10 10 0 0 0 -2.2 9.7Z M-10 0.9L-8.8 0.2L-7 -2.3L-7.2 -5L-7.5 -6.6A10 10 0 0 0 -10 0.9Z"
        className="fill-hero-ink"
      />
      <path
        d="M0 -4L0 -7.4 M3.8 -1.2L7 -2.3 M2.4 3.2L4.3 6 M-2.4 3.2L-4.3 6 M-3.8 -1.2L-7 -2.3 M2.6 -8.4L5.9 -8.1L7.2 -5 M8.8 0.2L9.5 3.1L7 5.3 M2.9 8.3L0 10L-2.9 8.3 M-7 5.3L-9.5 3.1L-8.8 0.2 M-7.2 -5L-5.9 -8.1L-2.6 -8.4"
        strokeWidth="1"
        className="stroke-hero-ink fill-none"
      />
    </g>
  )
}

export function PelotaDeTenis({ x, y, r }: Pelota) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r / 10})`}>
      <circle r="10" className="fill-hero-ball" />
      <path
        d="M-8.5 -5.3Q-3 0 -8.5 5.3 M8.5 -5.3Q3 0 8.5 5.3"
        strokeWidth="1.8"
        className="stroke-hero-line fill-none"
      />
    </g>
  )
}

export function PelotaDeBasquet({ x, y, r }: Pelota) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r / 10})`}>
      <circle r="10" className="fill-hero-orange" />
      <path
        d="M-10 0H10 M0 -10V10 M-7 -7Q-2 0 -7 7 M7 -7Q2 0 7 7"
        strokeWidth="1.2"
        className="stroke-hero-ink fill-none"
      />
    </g>
  )
}

// La pelota del deporte como ícono (chips, lista por deporte)
export function SportBall({ deporte, className }: { deporte: Deporte; className: string }) {
  const familia = familiaDelDeporte(deporte)

  return (
    <svg viewBox="-11 -11 22 22" aria-hidden="true" className={`shrink-0 ${className}`}>
      {familia === 'futbol' && <PelotaDeFutbol x={0} y={0} r={10} />}
      {(familia === 'tenis' || familia === 'padel') && <PelotaDeTenis x={0} y={0} r={10} />}
      {familia === 'basquet' && <PelotaDeBasquet x={0} y={0} r={10} />}
    </svg>
  )
}
