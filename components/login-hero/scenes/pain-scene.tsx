import { Phone } from 'lucide-react'

// Escena 0 (0–2,4 s): el punto de dolor. Para reservar una cancha hay que
// llamar a cada complejo y todos dicen que no. Después viene la solución
// (laptop y celular). El fondo es el mismo del escenario para que no se note
// el corte al volver a empezar el loop.
const COMPLEXES = [
  { y: 62, name: 'Complejo Norte', busyClass: 'hero-pain-busy-1', answer: 'Sin turnos' },
  { y: 124, name: 'Club Sur', busyClass: 'hero-pain-busy-2', answer: 'No atiende' },
  { y: 186, name: 'Polideportivo Este', busyClass: 'hero-pain-busy-3', answer: 'Ocupado' },
]

export function PainScene() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
      <g className="hero-pain">
        {COMPLEXES.map((complex) => (
          <g key={complex.name}>
            <rect
              x="50"
              y={complex.y}
              width="300"
              height="52"
              rx="12"
              strokeWidth="1.5"
              className="fill-card stroke-border"
            />
            <circle cx="80" cy={complex.y + 26} r="15" className="fill-secondary" />
            <g className="hero-pain-ring">
              <Phone
                x={72}
                y={complex.y + 18}
                width={16}
                height={16}
                className="stroke-muted-foreground"
              />
            </g>
            <text
              x="104"
              y={complex.y + 23}
              fontSize="12"
              fontWeight="600"
              className="fill-card-foreground"
            >
              {complex.name}
            </text>
            <text x="104" y={complex.y + 39} fontSize="10" className="fill-muted-foreground">
              Llamando…
            </text>

            <circle cx="272" cy={complex.y + 26} r="2.5" className="fill-muted-foreground/50" />
            <circle cx="282" cy={complex.y + 26} r="2.5" className="fill-muted-foreground/50" />
            <circle cx="292" cy={complex.y + 26} r="2.5" className="fill-muted-foreground/50" />

            <g className={complex.busyClass}>
              <rect
                x="236"
                y={complex.y + 8}
                width="106"
                height="36"
                rx="10"
                className="fill-card"
              />
              <rect
                x="240"
                y={complex.y + 14}
                width="98"
                height="24"
                rx="12"
                className="fill-destructive/10"
              />
              <circle cx="254" cy={complex.y + 26} r="7" className="fill-destructive" />
              <path
                d={`M251.5 ${complex.y + 23.5} l5 5 M256.5 ${complex.y + 23.5} l-5 5`}
                strokeWidth="1.8"
                strokeLinecap="round"
                className="stroke-background"
              />
              <text
                x="266"
                y={complex.y + 30}
                fontSize="10"
                fontWeight="600"
                className="fill-destructive"
              >
                {complex.answer}
              </text>
            </g>
          </g>
        ))}
      </g>
    </svg>
  )
}
