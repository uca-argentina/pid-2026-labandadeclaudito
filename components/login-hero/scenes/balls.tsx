// Pelotas ilustradas que se reusan en las escenas (se dibujan con radio 10 y se escalan).
type BallProps = { cx: number; cy: number; r: number }

// Pelota de fútbol clásica: pentágono negro al centro y, al final de cada
// costura, un pentágono negro cortado por el borde (hexágonos blancos entre).
// Dibujada con radio 10 y escalada.
export function SoccerBall({ cx, cy, r }: BallProps) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${r / 10})`}>
      <circle r="10" strokeWidth="0.8" className="stroke-hero-ink fill-hero-line" />
      <path
        d="M0 -4L3.8 -1.2L2.4 3.2L-2.4 3.2L-3.8 -1.2Z M-3.9 -9.2L-2.6 -8.4L0 -7.4L2.6 -8.4L3.9 -9.2A10 10 0 0 0 -3.9 -9.2Z M7.5 -6.6L7.2 -5L7 -2.3L8.8 0.2L10 0.9A10 10 0 0 0 7.5 -6.6Z M8.6 5.2L7 5.3L4.3 6L2.9 8.3L2.2 9.7A10 10 0 0 0 8.6 5.2Z M-2.2 9.7L-2.9 8.3L-4.3 6L-7 5.3L-8.6 5.2A10 10 0 0 0 -2.2 9.7Z M-10 0.9L-8.8 0.2L-7 -2.3L-7.2 -5L-7.5 -6.6A10 10 0 0 0 -10 0.9Z"
        className="fill-hero-ink"
      />
      <path
        d="M0 -4L0 -7.4 M3.8 -1.2L7 -2.3 M2.4 3.2L4.3 6 M-2.4 3.2L-4.3 6 M-3.8 -1.2L-7 -2.3 M2.6 -8.4L5.9 -8.1L7.2 -5 M8.8 0.2L9.5 3.1L7 5.3 M2.9 8.3L0 10L-2.9 8.3 M-7 5.3L-9.5 3.1L-8.8 0.2 M-7.2 -5L-5.9 -8.1L-2.6 -8.4"
        strokeWidth="1"
        className="fill-none stroke-hero-ink"
      />
    </g>
  )
}

// Pelota de básquet: naranja con las costuras en cruz y las dos curvas.
export function BasketBall({ cx, cy, r }: BallProps) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${r / 10})`}>
      <circle r="10" className="fill-hero-orange" />
      <path
        d="M-10 0H10 M0 -10V10 M-7 -7Q-2 0 -7 7 M7 -7Q2 0 7 7"
        strokeWidth="1.2"
        className="fill-none stroke-hero-ink"
      />
    </g>
  )
}

// Pelota de tenis/pádel: amarilla con las dos costuras curvas.
export function TennisBall({ cx, cy, r }: BallProps) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${r / 10})`}>
      <circle r="10" className="fill-hero-ball" />
      <path
        d="M-8.5 -5.3Q-3 0 -8.5 5.3 M8.5 -5.3Q3 0 8.5 5.3"
        strokeWidth="1.8"
        className="fill-none stroke-hero-line"
      />
    </g>
  )
}

// Paleta de pádel simplificada (cara redonda y mango).
export function PadelRacket({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <line
        x1="2"
        y1="2"
        x2="5"
        y2="5"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="stroke-hero-ink"
      />
      <circle cx="-0.5" cy="-0.5" r="4" className="fill-hero-padel" />
    </g>
  )
}
