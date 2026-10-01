import { SoccerBall, TennisBall } from './sports-montage'

// Chips de las reservas confirmadas. Viven en su propia capa (encima de todas
// las escenas) porque nacen en la laptop/celular y quedan fijos arriba hasta
// el final del montaje.
export function BookingChips() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
      <g transform="translate(36 14)">
        <g className="hero-chip-football">
          <ChipBody label="Fútbol 5 · 21:00" />
          <SoccerBall cx={16} cy={14} r={8} />
        </g>
      </g>

      <g transform="translate(208 14)">
        <g className="hero-chip-padel">
          <ChipBody label="Pádel · 19:30" />
          <TennisBall cx={16} cy={14} r={8} />
        </g>
      </g>
    </svg>
  )
}

function ChipBody({ label }: { label: string }) {
  return (
    <>
      <rect width="156" height="28" rx="14" strokeWidth="1.5" className="fill-card stroke-border" />
      <text x="30" y="18" fontSize="11" fontWeight="600" className="fill-card-foreground">
        {label}
      </text>
      {/* Check verde de confirmada */}
      <circle cx="142" cy="14" r="8" className="fill-primary" />
      <path
        d="M138 14 l2.8 2.8 l5 -5.6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground fill-none"
      />
    </>
  )
}
