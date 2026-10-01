import { Building2 } from 'lucide-react'
import { CAPTION_PLAY, SceneCaption } from './scene-caption'
import { TennisBall } from './balls'

// Escena "Grupo B llega y juega" (pádel, 2 contra 2): mismo recorrido que el
// fútbol (cartel, jugadores que entran, contador "4/4") y después un peloteo
// de ida y vuelta. Pádel 20 x 10 m (14 px/m), encerrada: vidrio en el fondo y
// en los primeros 4 m de cada lateral, malla en el resto.
const LEFT_TEAM = [
  { x: 130, y: 112 },
  { x: 130, y: 188 },
]
const RIGHT_TEAM = [
  { x: 270, y: 112 },
  { x: 270, y: 188 },
]

export function PadelScene() {
  return (
    <svg viewBox="0 0 400 340" className="absolute inset-0 size-full">
      <g className="hero-padel">
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

        <g strokeWidth="1.5" className="stroke-hero-line">
          {LEFT_TEAM.map((player, index) => (
            <g key={`left-${index}`} className={`hero-pplayer-${index + 1}`}>
              <circle cx={player.x} cy={player.y} r="6" className="fill-hero-team-red" />
            </g>
          ))}
          {RIGHT_TEAM.map((player, index) => (
            <g key={`right-${index}`} className={`hero-pplayer-${index + 3}`}>
              <circle cx={player.x} cy={player.y} r="6" className="fill-hero-team-blue" />
            </g>
          ))}
        </g>

        <g className="hero-pball">
          <TennisBall cx={200} cy={150} r={4.5} />
        </g>

        <g className="hero-pbanner">
          <rect
            x="70"
            y="12"
            width="260"
            height="30"
            rx="15"
            strokeWidth="1.5"
            className="fill-card stroke-border"
          />
          <Building2 x={86} y={19} width={16} height={16} className="stroke-primary" />
          <text x="110" y="31" fontSize="12" fontWeight="600" className="fill-card-foreground">
            Club Palermo · Pádel
          </text>
        </g>

        <g className="hero-pcount">
          <rect x="95" y="252" width="210" height="30" rx="15" className="fill-primary" />
          <text
            x="200"
            y="271"
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
            className="fill-primary-foreground"
          >
            ¡Llegaron todos! 4/4
          </text>
        </g>
        <SceneCaption text={CAPTION_PLAY} />
      </g>
    </svg>
  )
}
