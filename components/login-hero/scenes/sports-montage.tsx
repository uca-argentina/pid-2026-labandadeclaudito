// Escena 4 (7,5–11 s): canchas vistas desde arriba, una tras otra con
// fundido: fútbol, pádel, básquet y tenis. Una pelota cruza cada cancha.
// Sin animación (prefers-reduced-motion) queda visible la de fútbol.
export function SportsMontage() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
      <g className="hero-montage">
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
          <g className="hero-ball-football">
            <SoccerBall cx={200} cy={150} r={7} />
          </g>
          <CourtLabel text="Fútbol" />
        </g>

        {/* Pádel: 20 x 10 m (14 px/m). Encerrada: vidrio en el fondo y en los
            primeros 4 m de cada lateral, malla en el resto. Línea de saque a
            6,95 m de la red. */}
        <g className="hero-court-padel">
          <rect x="60" y="80" width="280" height="140" className="fill-hero-padel" />
          <g strokeWidth="2" className="stroke-white/90 fill-none">
            <line x1="103" y1="80" x2="103" y2="220" />
            <line x1="297" y1="80" x2="297" y2="220" />
            <line x1="103" y1="150" x2="297" y2="150" />
          </g>
          <path
            d="M116 80 H60 V220 H116 M284 80 H340 V220 H284"
            strokeWidth="5"
            className="stroke-sky-200/80 fill-none"
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
            className="stroke-white"
          />
          <g className="hero-ball-padel">
            <TennisBall cx={200} cy={150} r={4.5} />
          </g>
          <CourtLabel text="Pádel" />
        </g>

        <g className="hero-court-basketball">
          <rect x="80" y="58" width="240" height="184" rx="6" className="fill-accent" />
          <g strokeWidth="2" className="stroke-primary fill-none">
            <rect x="90" y="68" width="220" height="164" rx="2" />
            <line x1="200" y1="68" x2="200" y2="232" />
            <circle cx="200" cy="150" r="20" />
            <rect x="90" y="125" width="40" height="50" />
            <rect x="270" y="125" width="40" height="50" />
            <path d="M90 92 A62 58 0 0 1 90 208" />
            <path d="M310 92 A62 58 0 0 0 310 208" />
            <circle cx="100" cy="150" r="5" />
            <circle cx="300" cy="150" r="5" />
          </g>
          <g className="hero-ball-basketball">
            <circle cx="200" cy="150" r="7" className="fill-primary" />
            <g strokeWidth="1" className="stroke-primary-foreground fill-none">
              <line x1="193" y1="150" x2="207" y2="150" />
              <line x1="200" y1="143" x2="200" y2="157" />
            </g>
          </g>
          <CourtLabel text="Básquet" />
        </g>

        {/* Tenis en polvo de ladrillo: 23,77 x 10,97 m (8,4 px/m), pasillos
            de dobles, saque a 6,40 m de la red. */}
        <g className="hero-court-tennis">
          <rect x="64" y="78" width="272" height="144" rx="6" className="fill-hero-clay" />
          <g strokeWidth="2" className="stroke-white/90 fill-none">
            <rect x="100" y="104" width="200" height="92" />
            <line x1="100" y1="115" x2="300" y2="115" />
            <line x1="100" y1="185" x2="300" y2="185" />
            <line x1="146" y1="115" x2="146" y2="185" />
            <line x1="254" y1="115" x2="254" y2="185" />
            <line x1="146" y1="150" x2="254" y2="150" />
            <line x1="100" y1="150" x2="105" y2="150" />
            <line x1="295" y1="150" x2="300" y2="150" />
          </g>
          <line x1="200" y1="96" x2="200" y2="204" strokeWidth="3" className="stroke-neutral-800" />
          <g className="hero-ball-tennis">
            <TennisBall cx={200} cy={150} r={5} />
          </g>
          <CourtLabel text="Tenis" />
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
      <circle r="10" strokeWidth="0.8" className="stroke-neutral-900 fill-white" />
      <path
        d="M0 -4L3.8 -1.2L2.4 3.2L-2.4 3.2L-3.8 -1.2Z M-3.9 -9.2L-2.6 -8.4L0 -7.4L2.6 -8.4L3.9 -9.2A10 10 0 0 0 -3.9 -9.2Z M7.5 -6.6L7.2 -5L7 -2.3L8.8 0.2L10 0.9A10 10 0 0 0 7.5 -6.6Z M8.6 5.2L7 5.3L4.3 6L2.9 8.3L2.2 9.7A10 10 0 0 0 8.6 5.2Z M-2.2 9.7L-2.9 8.3L-4.3 6L-7 5.3L-8.6 5.2A10 10 0 0 0 -2.2 9.7Z M-10 0.9L-8.8 0.2L-7 -2.3L-7.2 -5L-7.5 -6.6A10 10 0 0 0 -10 0.9Z"
        className="fill-neutral-900"
      />
      <path
        d="M0 -4L0 -7.4 M3.8 -1.2L7 -2.3 M2.4 3.2L4.3 6 M-2.4 3.2L-4.3 6 M-3.8 -1.2L-7 -2.3 M2.6 -8.4L5.9 -8.1L7.2 -5 M8.8 0.2L9.5 3.1L7 5.3 M2.9 8.3L0 10L-2.9 8.3 M-7 5.3L-9.5 3.1L-8.8 0.2 M-7.2 -5L-5.9 -8.1L-2.6 -8.4"
        strokeWidth="1"
        className="fill-none stroke-neutral-900"
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
        className="fill-none stroke-white"
      />
    </g>
  )
}

function CourtLabel({ text }: { text: string }) {
  return (
    <text
      x="200"
      y="270"
      fontSize="13"
      fontWeight="600"
      textAnchor="middle"
      className="fill-muted-foreground"
    >
      {text}
    </text>
  )
}
