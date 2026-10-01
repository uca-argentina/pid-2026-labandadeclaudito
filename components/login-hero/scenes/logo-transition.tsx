import { Logo } from '@/components/logo'

// Escena 3 (6–7,5 s): el logo gira, un barrido tipo reloj pasa por encima y
// alrededor un sol orbita y se convierte en luna: pasa el tiempo.
const CLOCK_TICK_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

export function LogoTransition() {
  return (
    <div className="hero-logo-scene absolute inset-0">
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
        {/* Esfera del reloj */}
        <circle cx="200" cy="150" r="70" strokeWidth="2" className="stroke-primary/30 fill-none" />
        {CLOCK_TICK_ANGLES.map((angle) => (
          <line
            key={angle}
            x1="200"
            y1="72"
            x2="200"
            y2="80"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angle} 200 150)`}
            className="stroke-muted-foreground"
          />
        ))}

        {/* Sol → luna, sobre una órbita alrededor del centro */}
        <g className="hero-orbit">
          <g className="hero-sun">
            <circle cx="200" cy="55" r="9" className="fill-primary" />
            <line x1="200" y1="38" x2="200" y2="42" strokeWidth="2" className="stroke-primary" />
            <line x1="200" y1="68" x2="200" y2="72" strokeWidth="2" className="stroke-primary" />
            <line x1="183" y1="55" x2="187" y2="55" strokeWidth="2" className="stroke-primary" />
            <line x1="213" y1="55" x2="217" y2="55" strokeWidth="2" className="stroke-primary" />
          </g>
          <path
            d="M204 45 A11 11 0 1 0 204 65 A8 8 0 1 1 204 45 Z"
            className="hero-moon fill-secondary-foreground"
          />
        </g>
      </svg>

      <div className="absolute top-1/2 left-1/2 aspect-square w-1/4 -translate-x-1/2 -translate-y-1/2">
        <div className="hero-logo size-full">
          <Logo className="size-full" />
        </div>
      </div>

      {/* Barrido: una cuña semitransparente que da una vuelta sobre el logo */}
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
        <path d="M200 150 V80 A70 70 0 0 1 270 150 Z" className="hero-sweep fill-primary/25" />
      </svg>
    </div>
  )
}
