import { SoccerBall, TennisBall } from './sports-montage'

// Chips de las reservas confirmadas. Viven en su propia capa (encima de todas
// las escenas) porque nacen en la laptop/celular y quedan fijos arriba hasta
// el final del montaje.
export function BookingChips() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
      <g transform="translate(36 14)">
        <g className="hero-chip-football">
          <ChipBody label="Fútbol 5 · 21:00" complex="Complejo Oeste" />
          <SoccerBall cx={16} cy={18} r={8} />
        </g>
      </g>

      <g transform="translate(208 14)">
        <g className="hero-chip-padel">
          <ChipBody label="Pádel · 19:30" complex="Club Palermo" />
          <TennisBall cx={16} cy={18} r={8} />
        </g>
      </g>
    </svg>
  )
}

function ChipBody({ label, complex }: { label: string; complex: string }) {
  return (
    <>
      <rect width="156" height="36" rx="14" strokeWidth="1.5" className="fill-card stroke-border" />
      <text x="30" y="16" fontSize="11" fontWeight="600" className="fill-card-foreground">
        {label}
      </text>
      <text x="30" y="29" fontSize="9" className="fill-muted-foreground">
        {complex}
      </text>
      {/* Check verde de confirmada */}
      <circle cx="142" cy="18" r="8" className="fill-primary" />
      <path
        d="M138 18 l2.8 2.8 l5 -5.6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground fill-none"
      />
    </>
  )
}
