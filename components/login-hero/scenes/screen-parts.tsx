// Piezas que comparten las mini pantallas de la laptop y del celular
// (desktop-screens.tsx y mobile-screens.tsx).

// Tarjeta del front: sin borde y con una sombra apenas marcada abajo. La
// sombra es el mismo rectángulo corrido 1 px: un filtro de sombra de verdad se
// recalcula en cada cuadro y haría lenta la animación.
export function CardBox({
  x,
  y,
  width,
  height,
  rx,
  className = 'fill-card',
}: {
  x: number
  y: number
  width: number
  height: number
  rx: number
  className?: string
}) {
  return (
    <>
      <rect x={x} y={y + 1} width={width} height={height} rx={rx} className="fill-black/10" />
      <rect x={x} y={y} width={width} height={height} rx={rx} className={className} />
    </>
  )
}

// Franja de arriba del panel de reserva: la cancha vista desde arriba y
// acostada, como la franja de las tarjetas de reserva del front. Del fútbol
// se ven las áreas y el círculo central; del pádel, la red y los cuadros de saque.
export function CourtStrip({
  x,
  y,
  width,
  height,
  sport,
}: {
  x: number
  y: number
  width: number
  height: number
  sport: 'futbol' | 'padel'
}) {
  const middle = x + width / 2
  const bands = [0, 2, 4, 6]
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        className={sport === 'futbol' ? 'fill-primary' : 'fill-hero-padel'}
      />
      {bands.map((band) => (
        <rect
          key={band}
          x={x + (band * width) / 8}
          y={y}
          width={width / 8}
          height={height}
          className="fill-hero-line/10"
        />
      ))}
      <g strokeWidth="0.7" className="stroke-hero-line/80 fill-none">
        <line x1={middle} y1={y} x2={middle} y2={y + height} />
        {sport === 'futbol' ? (
          <>
            <circle cx={middle} cy={y + height / 2} r={height * 0.32} />
            <rect x={x - 1} y={y + 2} width={width * 0.1} height={height - 4} />
            <rect x={x + width * 0.9 + 1} y={y + 2} width={width * 0.1} height={height - 4} />
          </>
        ) : (
          <>
            <line x1={x + width * 0.2} y1={y} x2={x + width * 0.2} y2={y + height} />
            <line x1={x + width * 0.8} y1={y} x2={x + width * 0.8} y2={y + height} />
            <line
              x1={x + width * 0.2}
              y1={y + height / 2}
              x2={x + width * 0.8}
              y2={y + height / 2}
            />
          </>
        )}
      </g>
    </g>
  )
}
