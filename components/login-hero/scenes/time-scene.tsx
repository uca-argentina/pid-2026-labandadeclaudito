import { Logo } from '@/components/logo'
import { PadelRacket, SoccerBall } from './balls'
import { CAPTION_WAIT, SceneCaption } from './scene-caption'

// Escena del paso del tiempo, una por reserva (id "a" fútbol, id "b" pádel):
// la reserva se vuelve un ticket, una cuenta regresiva pasa de "Faltan 2 días"
// a "¡Es hoy!" mientras una barra se llena, y el logo late. Cuenta que entre
// reservar y jugar pasa el tiempo, sin explicarlo con texto largo.
type TimeSceneProps = {
  id: 'a' | 'b'
  sport: 'futbol' | 'padel'
  title: string
  complex: string
}

export function TimeScene({ id, sport, title, complex }: TimeSceneProps) {
  return (
    <div className={`hero-time-${id} absolute inset-0`}>
      <div className="absolute top-[4%] left-1/2 aspect-square w-[13%] -translate-x-1/2">
        <div className={`hero-logo-${id} size-full`}>
          <Logo className="size-full" />
        </div>
      </div>

      <svg viewBox="0 0 400 340" className="absolute inset-0 size-full">
        <g className={`hero-ticket-${id}`}>
          <rect
            x="50"
            y="70"
            width="300"
            height="100"
            rx="16"
            strokeWidth="1.5"
            className="fill-card stroke-border"
          />
          <circle cx="92" cy="120" r="26" className="fill-primary/15" />
          {sport === 'futbol' ? (
            <SoccerBall cx={92} cy={120} r={14} />
          ) : (
            <PadelRacket cx={90} cy={118} scale={3.2} />
          )}
          <text x="132" y="108" fontSize="14" fontWeight="600" className="fill-card-foreground">
            {title}
          </text>
          <text x="132" y="127" fontSize="11" className="fill-muted-foreground">
            {complex}
          </text>
          <circle cx="139" cy="147" r="7" className="fill-primary" />
          <path
            d="M135.5 147 l2.5 2.5 l4.5 -5"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-primary-foreground fill-none"
          />
          <text x="152" y="151" fontSize="11" fontWeight="600" className="fill-primary">
            Reserva confirmada
          </text>
        </g>

        <text
          x="200"
          y="222"
          fontSize="24"
          fontWeight="700"
          textAnchor="middle"
          className={`hero-days-${id} fill-foreground`}
        >
          Faltan 2 días
        </text>
        <text
          x="200"
          y="222"
          fontSize="24"
          fontWeight="700"
          textAnchor="middle"
          className={`hero-today-${id} fill-primary`}
        >
          ¡Es hoy!
        </text>

        <rect x="90" y="242" width="220" height="6" rx="3" className="fill-border" />
        <rect
          x="90"
          y="242"
          width="220"
          height="6"
          rx="3"
          className={`hero-bar-${id} fill-primary`}
        />
        <text x="90" y="266" fontSize="10" className="fill-muted-foreground">
          Reservaste
        </text>
        <text x="310" y="266" fontSize="10" textAnchor="end" className="fill-muted-foreground">
          El partido
        </text>
        <SceneCaption text={CAPTION_WAIT} />
      </svg>
    </div>
  )
}
