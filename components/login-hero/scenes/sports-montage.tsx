// Escena 4 (8,8–13 s): se juega lo que se reservó, visto desde arriba: primero
// fútbol (4 jugadores se pasan la pelota y termina en gol) y después pádel
// (peloteo de ida y vuelta). Los demás deportes se ven en el selector de las
// pantallas de reserva (laptop y celular).
// Sin animación (prefers-reduced-motion) queda visible la de fútbol.
export function SportsMontage() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
      <g className="hero-montage">
        <Friends />
        <g className="hero-court-football">
          <rect x="80" y="58" width="240" height="184" rx="6" className="fill-primary" />
          <g strokeWidth="2" className="stroke-primary-foreground/70 fill-none">
            <rect x="90" y="68" width="220" height="164" rx="2" />
            <line x1="200" y1="68" x2="200" y2="232" />
            <circle cx="200" cy="150" r="22" />
            <rect x="90" y="115" width="30" height="70" />
            <rect x="280" y="115" width="30" height="70" />
            <rect x="84" y="135" width="6" height="30" />
            <rect x="310" y="135" width="6" height="30" />
          </g>
          {/* Jugadores que se pasan la pelota (ver hero-ball-football en el
              CSS) y el arquero rival, que queda tirado al palo equivocado */}
          <g strokeWidth="1.5" className="stroke-hero-line">
            <circle cx="130" cy="190" r="5.5" className="fill-hero-team-red" />
            <circle cx="175" cy="100" r="5.5" className="fill-hero-team-red" />
            <circle cx="235" cy="175" r="5.5" className="fill-hero-team-red" />
            <circle cx="270" cy="115" r="5.5" className="fill-hero-team-red" />
            <circle cx="303" cy="160" r="5.5" className="fill-hero-team-blue" />
          </g>
          <g className="hero-ball-football">
            <SoccerBall cx={200} cy={150} r={5.5} />
          </g>
          <CourtLabel text="Fútbol 5 · Complejo Oeste" />
        </g>

        {/* Pádel: 20 x 10 m (14 px/m). Encerrada: vidrio en el fondo y en los
            primeros 4 m de cada lateral, malla en el resto. Línea de saque a
            6,95 m de la red. */}
        <g className="hero-court-padel">
          <rect x="60" y="80" width="280" height="140" className="fill-hero-padel" />
          <g strokeWidth="2" className="stroke-hero-line/90 fill-none">
            <line x1="103" y1="80" x2="103" y2="220" />
            <line x1="297" y1="80" x2="297" y2="220" />
            <line x1="103" y1="150" x2="297" y2="150" />
          </g>
          <path
            d="M116 80 H60 V220 H116 M284 80 H340 V220 H284"
            strokeWidth="5"
            className="stroke-hero-glass/80 fill-none"
          />
          <path
            d="M116 80 H284 M116 220 H284"
            strokeWidth="3"
            strokeDasharray="2 2"
            className="stroke-muted-foreground fill-none"
          />
          <line
            x1="200"
            y1="76"
            x2="200"
            y2="224"
            strokeWidth="3"
            strokeDasharray="4 2"
            className="stroke-hero-line"
          />
          <g className="hero-ball-padel">
            <TennisBall cx={200} cy={150} r={4.5} />
          </g>
          <CourtLabel text="Pádel · Club Palermo" />
        </g>
      </g>
    </svg>
  )
}

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

function CourtLabel({ text }: { text: string }) {
  return (
    <text
      x="364"
      y="276"
      fontSize="12"
      fontWeight="600"
      textAnchor="end"
      className="fill-muted-foreground"
    >
      {text}
    </text>
  )
}

// Los amigos que juegan: círculos sin cara con su inicial, y "+3" por los que
// faltan. Aparece con el montaje (queda dentro de .hero-montage).
function Friends() {
  return (
    <g>
      <circle cx="46" cy="270" r="11" strokeWidth="2" className="fill-primary stroke-background" />
      <circle
        cx="62"
        cy="270"
        r="11"
        strokeWidth="2"
        className="fill-hero-team-red stroke-background"
      />
      <circle
        cx="78"
        cy="270"
        r="11"
        strokeWidth="2"
        className="fill-hero-team-blue stroke-background"
      />
      <text
        x="46"
        y="274"
        fontSize="10"
        fontWeight="600"
        textAnchor="middle"
        className="fill-primary-foreground"
      >
        J
      </text>
      <text
        x="62"
        y="274"
        fontSize="10"
        fontWeight="600"
        textAnchor="middle"
        className="fill-hero-line"
      >
        M
      </text>
      <text
        x="78"
        y="274"
        fontSize="10"
        fontWeight="600"
        textAnchor="middle"
        className="fill-hero-line"
      >
        L
      </text>
      <text x="98" y="275" fontSize="11" fontWeight="600" className="fill-muted-foreground">
        +3 amigos
      </text>
    </g>
  )
}

// Fila de deportes disponibles (fútbol, pádel, básquet y tenis) para las
// pantallas de reserva: muestra que la app sirve para varios deportes y marca
// cuál se está reservando. `selected` es el índice del deporte elegido.
export function SportPicker({
  x,
  y,
  selected,
  ringClass,
}: {
  x: number
  y: number
  selected: number
  ringClass: string
}) {
  const centers = [0, 16, 32, 48]
  return (
    <g>
      {centers.map((dx, index) => (
        <g key={dx} opacity={index === selected ? 1 : 0.5}>
          {index === 0 && <SoccerBall cx={x + dx} cy={y} r={4} />}
          {index === 1 && <PadelRacket cx={x + dx} cy={y} />}
          {index === 2 && <BasketBall cx={x + dx} cy={y} r={4} />}
          {index === 3 && <TennisBall cx={x + dx} cy={y} r={4} />}
        </g>
      ))}
      <circle
        cx={x + centers[selected]}
        cy={y}
        r="6"
        strokeWidth="1.5"
        className={`fill-none ${ringClass}`}
      />
    </g>
  )
}

// Paleta de pádel simplificada (cara redonda y mango) para el selector.
function PadelRacket({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <line
        x1={cx + 2}
        y1={cy + 2}
        x2={cx + 5}
        y2={cy + 5}
        strokeWidth="1.6"
        strokeLinecap="round"
        className="stroke-hero-ink"
      />
      <circle cx={cx - 0.5} cy={cy - 0.5} r="4" className="fill-hero-padel" />
    </g>
  )
}
