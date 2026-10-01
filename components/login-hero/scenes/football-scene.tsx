import { Building2 } from 'lucide-react'
import { CAPTION_PLAY, SceneCaption } from './scene-caption'
import { SoccerBall } from './balls'

// Escena "Grupo A llega y juega" (fútbol 5, 5 contra 5): el cartel del complejo
// baja, los 10 jugadores entran corriendo desde los costados, aparece el
// contador "10/10", sale la pelota (pases) y termina en gol.
// Cada jugador tiene su animación (hero-fplayer-1 … 10) para que entren de a
// uno. Sin animación (prefers-reduced-motion) queda este cuadro: todos en
// su lugar y el contador. Los puntos no tienen cara: solo el color del equipo.
const RED_TEAM = [
  { x: 105, y: 150 },
  { x: 140, y: 110 },
  { x: 140, y: 190 },
  { x: 175, y: 125 },
  { x: 175, y: 175 },
]
const BLUE_TEAM = [
  { x: 295, y: 150 },
  { x: 260, y: 110 },
  { x: 260, y: 190 },
  { x: 225, y: 125 },
  { x: 225, y: 175 },
]

export function FootballScene() {
  return (
    <svg viewBox="0 0 400 340" className="absolute inset-0 size-full">
      <g className="hero-football">
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
        <rect
          x="304"
          y="132"
          width="14"
          height="36"
          rx="2"
          className="hero-fgoal fill-hero-line/60"
        />

        <g strokeWidth="1.5" className="stroke-hero-line">
          {RED_TEAM.map((player, index) => (
            <g key={`red-${index}`} className={`hero-fplayer-${index + 1}`}>
              <g className="hero-fcheer">
                <circle cx={player.x} cy={player.y} r="6" className="fill-hero-team-red" />
              </g>
            </g>
          ))}
          {BLUE_TEAM.map((player, index) => (
            <g key={`blue-${index}`} className={`hero-fplayer-${index + 6}`}>
              <circle cx={player.x} cy={player.y} r="6" className="fill-hero-team-blue" />
            </g>
          ))}
        </g>

        <g className="hero-fball">
          <SoccerBall cx={200} cy={150} r={5.5} />
        </g>

        <g className="hero-fbanner">
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
            Complejo Oeste · Fútbol 5
          </text>
        </g>

        <g className="hero-fcount">
          <rect x="95" y="252" width="210" height="30" rx="15" className="fill-primary" />
          <text
            x="200"
            y="271"
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
            className="fill-primary-foreground"
          >
            ¡Llegaron todos! 10/10
          </text>
        </g>
        <SceneCaption text={CAPTION_PLAY} />
      </g>
    </svg>
  )
}
