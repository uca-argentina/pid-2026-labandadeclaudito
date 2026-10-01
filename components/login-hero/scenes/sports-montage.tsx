// Escena 4 (7,5–13,75 s): canchas vistas desde arriba, una tras otra con
// fundido: fútbol, pádel, básquet y tenis. Una pelota cruza cada cancha; en
// la de fútbol se la pasan 4 jugadores y termina en gol.
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
          {/* Jugadores que se pasan la pelota (ver hero-ball-football en el
              CSS) y el arquero rival, que queda tirado al palo equivocado */}
          <g strokeWidth="1.5" className="stroke-white">
            <circle cx="130" cy="190" r="5.5" className="fill-red-500" />
            <circle cx="175" cy="100" r="5.5" className="fill-red-500" />
            <circle cx="235" cy="175" r="5.5" className="fill-red-500" />
            <circle cx="270" cy="115" r="5.5" className="fill-red-500" />
            <circle cx="303" cy="160" r="5.5" className="fill-sky-500" />
          </g>
          <g className="hero-ball-football">
            <SoccerBall cx={200} cy={150} r={5.5} />
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

        {/* Básquet FIBA: 28 x 15 m (7,86 px/m), parquet. Línea de 3 a 6,75 m
            del aro (recta en las esquinas). Un jugador tira un triple: la
            pelota "sube" agrandándose (vista desde arriba) y cae en el aro. */}
        <g className="hero-court-basketball">
          <rect x="74" y="80" width="252" height="140" rx="6" className="fill-hero-wood" />
          <rect x="90" y="131" width="46" height="38" className="fill-orange-400" />
          <rect x="264" y="131" width="46" height="38" className="fill-orange-400" />
          <g strokeWidth="2" className="fill-none stroke-white">
            <rect x="90" y="91" width="220" height="118" />
            <line x1="200" y1="91" x2="200" y2="209" />
            <circle cx="200" cy="150" r="14" />
            <rect x="90" y="131" width="46" height="38" />
            <rect x="264" y="131" width="46" height="38" />
            <path d="M136 136 A14 14 0 0 1 136 164 M264 136 A14 14 0 0 0 264 164" />
            <path d="M90 98 H112 A53 53 0 0 1 112 202 H90 M310 98 H288 A53 53 0 0 0 288 202 H310" />
          </g>
          {/* Tableros */}
          <path d="M99 143 V157 M301 143 V157" strokeWidth="3" className="stroke-neutral-800" />
          <circle
            cx="218"
            cy="118"
            r="5.5"
            strokeWidth="1.5"
            className="fill-red-500 stroke-white"
          />
          <g className="hero-ball-basketball">
            <BasketBall cx={200} cy={150} r={5} />
          </g>
          {/* Aros encima de la pelota: al final queda "adentro" */}
          <g strokeWidth="1.5" className="fill-none stroke-orange-600">
            <circle cx="102" cy="150" r="5" />
            <circle cx="298" cy="150" r="5" />
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

// Pelota de básquet: naranja con las costuras en cruz y las dos curvas.
export function BasketBall({ cx, cy, r }: BallProps) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${r / 10})`}>
      <circle r="10" className="fill-orange-500" />
      <path
        d="M-10 0H10 M0 -10V10 M-7 -7Q-2 0 -7 7 M7 -7Q2 0 7 7"
        strokeWidth="1.2"
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
