import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Home,
  MapPin,
  Search,
  Shapes,
  SlidersHorizontal,
  Trophy,
  Wallet,
} from 'lucide-react'
import { SoccerBall } from './balls'

// Pantalla de la laptop: la web app real vista en escritorio, dibujada con los
// mismos textos y la misma estructura que el front (sidebar del jugador,
// "Buscar canchas", panel de filtros con el select de Deporte, card de cancha
// con "Reservar" y panel de reserva con la grilla de horarios).
// Las coordenadas son las de la pantalla de la laptop (x 63–337, y 25–181).
// Cada pieza que cambia con el tiempo es un <g> con su clase hero-d-* (ver
// login-hero.css, bloque "Grupo A: laptop").
const SPORT_OPTIONS = ['Todos', 'Fútbol 5', 'Fútbol 7', 'Fútbol 11', 'Tenis', 'Pádel', 'Básquet']

const COMPLEXES = [
  {
    x: 131,
    name: 'Complejo Oeste',
    address: 'Rivadavia 4500 · Caballito',
    courts: '3 canchas',
    sports: ['Fútbol 5', 'Fútbol 7'],
    price: '$18.000',
    photoClass: 'fill-primary/30',
  },
  {
    x: 199,
    name: 'Club Palermo',
    address: 'Soler 3800 · Palermo',
    courts: '2 canchas',
    sports: ['Pádel', 'Tenis'],
    price: '$24.000',
    photoClass: 'fill-hero-padel/30',
  },
  {
    x: 267,
    name: 'Club Belgrano',
    address: 'Cabildo 900 · Belgrano',
    courts: '4 canchas',
    sports: ['Básquet', 'Tenis'],
    price: '$15.000',
    photoClass: 'fill-hero-orange/30',
  },
]

const SLOT_COLUMNS = [197, 229, 261, 293]
const SLOTS = [
  { time: '17:00', x: SLOT_COLUMNS[0], y: 76, free: true, price: '$18.000' },
  { time: '18:00', x: SLOT_COLUMNS[1], y: 76, free: false, price: '$18.000' },
  { time: '19:00', x: SLOT_COLUMNS[2], y: 76, free: true, price: '$18.000' },
  { time: '20:00', x: SLOT_COLUMNS[3], y: 76, free: true, price: '$22.000' },
  { time: '21:00', x: SLOT_COLUMNS[0], y: 95, free: true, price: '$22.000' },
  { time: '22:00', x: SLOT_COLUMNS[1], y: 95, free: true, price: '$22.000' },
  { time: '23:00', x: SLOT_COLUMNS[2], y: 95, free: false, price: '$22.000' },
  { time: '00:00', x: SLOT_COLUMNS[3], y: 95, free: true, price: '$22.000' },
]

export function DesktopScreens() {
  return (
    <>
      <defs>
        <clipPath id="hero-d-screen">
          <rect x="63" y="25" width="274" height="156" rx="3" />
        </clipPath>
        <clipPath id="hero-d-strip">
          <polygon points="131,76 148,76 161,138 131,138" />
        </clipPath>
      </defs>

      <g clipPath="url(#hero-d-screen)">
        <rect x="63" y="25" width="274" height="156" className="fill-background" />
        <Sidebar />

        <g className="hero-d-list">
          <ListPage />
        </g>
        <g className="hero-d-detail">
          <DetailPage />
        </g>

        <g className="hero-d-scrim1">
          <rect x="122" y="25" width="215" height="156" className="fill-foreground/30" />
        </g>
        <g className="hero-d-sheet1">
          <FilterSheet />
        </g>

        <g className="hero-d-scrim2">
          <rect x="122" y="25" width="215" height="156" className="fill-foreground/30" />
        </g>
        <g className="hero-d-sheet2">
          <BookingSheet />
        </g>
      </g>
    </>
  )
}

function Sidebar() {
  const items = [
    { label: 'Inicio', Icon: Home, y: 52, active: false },
    { label: 'Buscar canchas', Icon: Search, y: 65, active: true },
    { label: 'Mis reservas', Icon: CalendarDays, y: 78, active: false },
  ]
  return (
    <g>
      <rect x="63" y="25" width="58" height="156" className="fill-card" />
      <line x1="121" y1="25" x2="121" y2="181" strokeWidth="1" className="stroke-border" />

      <circle cx="73" cy="37" r="6" className="fill-primary/15" />
      <SoccerBall cx={73} cy={37} r={4.2} />
      <text x="82" y="39.5" fontSize="6.4" fontWeight="800" className="fill-foreground">
        Toca<tspan className="fill-primary">Y</tspan>Juga
      </text>

      {items.map((item) => (
        <g key={item.label}>
          {item.active && (
            <rect x="67" y={item.y} width="50" height="11" rx="3" className="fill-accent" />
          )}
          <item.Icon x={71} y={item.y + 3} width={5} height={5} className="stroke-foreground" />
          <text
            x="79"
            y={item.y + 7.4}
            fontSize="4.8"
            fontWeight={item.active ? 600 : 400}
            className="fill-foreground"
          >
            {item.label}
          </text>
        </g>
      ))}

      <circle cx="73" cy="167" r="5" className="fill-muted" />
      <text
        x="73"
        y="168.4"
        fontSize="3.8"
        fontWeight="600"
        textAnchor="middle"
        className="fill-foreground"
      >
        JP
      </text>
      <text x="81" y="166.5" fontSize="4.4" fontWeight="500" className="fill-foreground">
        Juan Pérez
      </text>
      <text x="81" y="171.5" fontSize="3.6" className="fill-muted-foreground">
        juan@mail.com
      </text>
    </g>
  )
}

function ListPage() {
  return (
    <g>
      <text x="131" y="45" fontSize="10" fontWeight="600" className="fill-foreground">
        Buscar canchas
      </text>
      <text x="131" y="53" fontSize="4.2" className="fill-muted-foreground">
        Filtrá por zona, deporte, superficie, precio, fecha y horario para encontrar una cancha.
      </text>

      <rect
        x="131"
        y="60"
        width="40"
        height="13"
        rx="4"
        strokeWidth="1"
        className="fill-background stroke-border"
      />
      <SlidersHorizontal x={136} y={63.5} width={6} height={6} className="stroke-foreground" />
      <text x="145" y="68.6" fontSize="5.6" fontWeight="500" className="fill-foreground">
        Filtros
      </text>

      {COMPLEXES.map((complex) => (
        <ComplexCard key={complex.name} complex={complex} />
      ))}
    </g>
  )
}

function ComplexCard({ complex }: { complex: (typeof COMPLEXES)[number] }) {
  const { x } = complex
  const y = 80
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="60"
        height="98"
        rx="6"
        strokeWidth="1"
        className="fill-card stroke-border"
      />
      <path
        d={`M${x} ${y + 30} V${y + 6} a6 6 0 0 1 6 -6 H${x + 54} a6 6 0 0 1 6 6 V${y + 30} Z`}
        className={complex.photoClass}
      />
      <rect
        x={x + 8}
        y={y + 6}
        width="44"
        height="18"
        rx="1.5"
        strokeWidth="0.8"
        className="stroke-hero-line/70 fill-none"
      />
      <line
        x1={x + 30}
        y1={y + 6}
        x2={x + 30}
        y2={y + 24}
        strokeWidth="0.8"
        className="stroke-hero-line/70"
      />

      <text x={x + 6} y={y + 41} fontSize="5.6" fontWeight="600" className="fill-card-foreground">
        {complex.name}
      </text>
      <MapPin x={x + 6} y={y + 44} width={4} height={4} className="stroke-muted-foreground" />
      <text x={x + 12} y={y + 47.4} fontSize="3.3" className="fill-muted-foreground">
        {complex.address}
      </text>
      <Shapes x={x + 6} y={y + 50} width={4} height={4} className="stroke-muted-foreground" />
      <text x={x + 12} y={y + 53.4} fontSize="3.3" className="fill-muted-foreground">
        {complex.courts}
      </text>

      {complex.sports.map((sport, index) => (
        <g key={sport}>
          <rect
            x={x + 6 + index * 24}
            y={y + 59}
            width="21"
            height="7.5"
            rx="3.75"
            className="fill-secondary"
          />
          <text
            x={x + 16.5 + index * 24}
            y={y + 64.2}
            fontSize="3.4"
            textAnchor="middle"
            className="fill-secondary-foreground"
          >
            {sport}
          </text>
        </g>
      ))}

      <line x1={x} y1={y + 74} x2={x + 60} y2={y + 74} strokeWidth="1" className="stroke-border" />
      <Wallet x={x + 6} y={y + 78} width={5} height={5} className="stroke-primary" />
      <text x={x + 13} y={y + 82} fontSize="3.3" className="fill-muted-foreground">
        desde
      </text>
      <text x={x + 24} y={y + 83} fontSize="6.4" fontWeight="700" className="fill-primary">
        {complex.price}
      </text>
    </g>
  )
}

function DetailPage() {
  return (
    <g>
      <text x="131" y="45" fontSize="10" fontWeight="600" className="fill-foreground">
        Complejo Oeste
      </text>
      <MapPin x={131} y={48.5} width={4.5} height={4.5} className="stroke-muted-foreground" />
      <text x="137" y="52.4" fontSize="4.2" className="fill-muted-foreground">
        Rivadavia 4500 · Caballito
      </text>
      <text x="131" y="68" fontSize="7" fontWeight="600" className="fill-foreground">
        Canchas
      </text>

      <CourtCard y={76} sport="FÚTBOL 5 · CÉSPED SINTÉTICO" name="Cancha 1" button />
      <CourtCard y={146} sport="FÚTBOL 7 · CÉSPED SINTÉTICO" name="Cancha 2" />
    </g>
  )
}

function CourtCard({
  y,
  sport,
  name,
  button = false,
}: {
  y: number
  sport: string
  name: string
  button?: boolean
}) {
  return (
    <g>
      <rect
        x="131"
        y={y}
        width="196"
        height="62"
        rx="8"
        strokeWidth="1"
        className="fill-card stroke-border"
      />
      <g transform={`translate(0 ${y - 76})`}>
        <g clipPath="url(#hero-d-strip)" opacity="0.8">
          <rect x="131" y="76" width="30" height="62" className="fill-primary" />
          <rect x="131" y="76" width="30" height="8" className="fill-hero-line/10" />
          <rect x="131" y="92" width="30" height="8" className="fill-hero-line/10" />
          <rect x="131" y="108" width="30" height="8" className="fill-hero-line/10" />
          <rect x="131" y="124" width="30" height="8" className="fill-hero-line/10" />
          <rect
            x="136"
            y="82"
            width="20"
            height="50"
            strokeWidth="0.8"
            className="stroke-hero-line fill-none"
          />
          <line
            x1="136"
            y1="107"
            x2="156"
            y2="107"
            strokeWidth="0.8"
            className="stroke-hero-line"
          />
          <circle
            cx="146"
            cy="107"
            r="5"
            strokeWidth="0.8"
            className="stroke-hero-line fill-none"
          />
        </g>
        <line x1="148" y1="76" x2="161" y2="138" strokeWidth="0.8" className="stroke-primary/50" />
      </g>

      <text x="168" y={y + 12} fontSize="3.8" fontWeight="600" className="fill-primary">
        {sport}
      </text>
      <text x="168" y={y + 22} fontSize="8" fontWeight="700" className="fill-card-foreground">
        {name}
      </text>
      <Clock x={168} y={y + 25.5} width={4} height={4} className="stroke-muted-foreground" />
      <text x="174" y={y + 29} fontSize="3.8" className="fill-muted-foreground">
        08:00 a 24:00 hs
      </text>

      <text x="168" y={y + 42} fontSize="3.6" className="fill-muted-foreground">
        desde
      </text>
      <text x="168" y={y + 51} fontSize="8.5" fontWeight="700" className="fill-primary">
        $18.000
      </text>
      <text x="168" y={y + 57} fontSize="3.4" className="fill-muted-foreground">
        por turno de 60 min
      </text>

      {button && (
        <g>
          <rect x="275" y={y + 38} width="44" height="14" rx="4" className="fill-primary" />
          <CalendarDays
            x={280}
            y={y + 42}
            width={6}
            height={6}
            className="stroke-primary-foreground"
          />
          <text
            x="289"
            y={y + 47}
            fontSize="5.4"
            fontWeight="500"
            className="fill-primary-foreground"
          >
            Reservar
          </text>
        </g>
      )}
    </g>
  )
}

function FilterSheet() {
  return (
    <g>
      <rect
        x="187"
        y="25"
        width="150"
        height="156"
        strokeWidth="1"
        className="fill-background stroke-border"
      />
      <text x="197" y="40" fontSize="8.5" fontWeight="600" className="fill-foreground">
        Filtros
      </text>
      <text x="197" y="48" fontSize="4" className="fill-muted-foreground">
        Combiná los que quieras para encontrar tu cancha.
      </text>
      <text x="197" y="63" fontSize="6" fontWeight="600" className="fill-foreground">
        Cancha
      </text>

      <MapPin x={197} y={67.5} width={4.5} height={4.5} className="stroke-foreground" />
      <text x="203" y="71.5" fontSize="4.6" fontWeight="500" className="fill-foreground">
        Zona
      </text>
      <rect
        x="197"
        y="75"
        width="130"
        height="13"
        rx="4"
        strokeWidth="1"
        className="fill-background stroke-border"
      />
      <text x="202" y="83.3" fontSize="5" className="fill-foreground">
        Todas
      </text>
      <ChevronDown x={317} y={78.5} width={6} height={6} className="stroke-muted-foreground" />

      <Trophy x={197} y={93.5} width={4.5} height={4.5} className="stroke-foreground" />
      <text x="203" y="97.5" fontSize="4.6" fontWeight="500" className="fill-foreground">
        Deporte
      </text>
      <rect
        x="197"
        y="102"
        width="130"
        height="14"
        rx="4"
        strokeWidth="1"
        className="fill-background stroke-border"
      />
      <text x="202" y="110.6" fontSize="5" className="hero-d-val-all fill-foreground">
        Todos
      </text>
      <text x="202" y="110.6" fontSize="5" className="hero-d-val-f5 fill-foreground">
        Fútbol 5
      </text>
      <ChevronDown x={317} y={106} width={6} height={6} className="stroke-muted-foreground" />

      <g className="hero-d-surf">
        <text x="203" y="127.5" fontSize="4.6" fontWeight="500" className="fill-foreground">
          Superficie
        </text>
        <rect
          x="197"
          y="131"
          width="130"
          height="14"
          rx="4"
          strokeWidth="1"
          className="fill-background stroke-border"
        />
        <text x="202" y="139.6" fontSize="5" className="fill-foreground">
          Todas
        </text>
        <ChevronDown x={317} y={135} width={6} height={6} className="stroke-muted-foreground" />
      </g>

      <line x1="187" y1="159" x2="337" y2="159" strokeWidth="1" className="stroke-border" />
      <text x="203" y="171" fontSize="5" className="fill-foreground">
        Limpiar filtros
      </text>
      <rect x="262" y="164" width="65" height="13" rx="4" className="fill-primary" />
      <Search x={266} y={167.5} width={6} height={6} className="stroke-primary-foreground" />
      <text x="275" y="172.6" fontSize="5" fontWeight="500" className="fill-primary-foreground">
        Ver resultados
      </text>

      {/* Lista del select de Deporte con las 6 opciones reales + "Todos" */}
      <g className="hero-d-dd">
        <rect
          x="197"
          y="118"
          width="130"
          height="52"
          rx="3"
          strokeWidth="1"
          className="fill-card stroke-border"
        />
        <rect
          x="198"
          y="118.6"
          width="128"
          height="7.2"
          rx="2"
          className="hero-d-hl fill-primary/25"
        />
        {SPORT_OPTIONS.map((option, index) => (
          <text
            key={option}
            x="203"
            y={123.6 + index * 7.4}
            fontSize="4.6"
            className="fill-foreground"
          >
            {option}
          </text>
        ))}
      </g>
    </g>
  )
}

function BookingSheet() {
  return (
    <g>
      <rect
        x="187"
        y="25"
        width="150"
        height="156"
        strokeWidth="1"
        className="fill-background stroke-border"
      />
      <text x="197" y="40" fontSize="8.5" fontWeight="600" className="fill-foreground">
        Cancha 1
      </text>
      <text x="197" y="48" fontSize="3.8" className="fill-muted-foreground">
        Fútbol 5 · Precio base $18.000 por turno de 60 min.
      </text>
      <text x="197" y="53" fontSize="3.8" className="fill-muted-foreground">
        Algunos turnos pueden tener precio especial.
      </text>

      <CalendarDays x={197} y={59} width={5} height={5} className="stroke-foreground" />
      <text x="204" y="63" fontSize="5" fontWeight="500" className="fill-foreground">
        Fecha
      </text>
      <rect
        x="224"
        y="57"
        width="70"
        height="11"
        rx="3"
        strokeWidth="1"
        className="fill-background stroke-border"
      />
      <text x="229" y="64.4" fontSize="4.6" className="fill-foreground">
        03/10/2026
      </text>

      {SLOTS.map((slot) => (
        <g key={slot.time}>
          <rect
            x={slot.x}
            y={slot.y}
            width="28"
            height="15"
            rx="4"
            strokeWidth="1"
            className={slot.free ? 'fill-background stroke-border' : 'fill-muted stroke-border'}
          />
          <text
            x={slot.x + 14}
            y={slot.y + 7}
            fontSize="5.4"
            fontWeight="500"
            textAnchor="middle"
            className={slot.free ? 'fill-foreground' : 'fill-muted-foreground/60'}
          >
            {slot.time}
          </text>
          <text
            x={slot.x + 14}
            y={slot.y + 12.4}
            fontSize="3.2"
            textAnchor="middle"
            className="fill-muted-foreground"
          >
            {slot.price}
          </text>
        </g>
      ))}

      {/* Horario elegido (21:00) */}
      <g className="hero-d-slot">
        <rect x="197" y="95" width="28" height="15" rx="4" className="fill-primary" />
        <text
          x="211"
          y="102"
          fontSize="5.4"
          fontWeight="500"
          textAnchor="middle"
          className="fill-primary-foreground"
        >
          21:00
        </text>
        <text
          x="211"
          y="107.4"
          fontSize="3.2"
          textAnchor="middle"
          className="fill-primary-foreground/80"
        >
          $22.000
        </text>
      </g>

      <g className="hero-d-summary">
        <rect
          x="197"
          y="118"
          width="130"
          height="30"
          rx="5"
          strokeWidth="1"
          className="fill-secondary stroke-border"
        />
        <text x="204" y="128" fontSize="5" fontWeight="500" className="fill-foreground">
          21:00 a 22:00 hs
        </text>
        <text x="204" y="139" fontSize="4.4" className="fill-muted-foreground">
          Precio del turno:
        </text>
        <text x="236" y="139" fontSize="4.8" fontWeight="600" className="fill-foreground">
          $22.000
        </text>
        <rect x="259" y="133" width="42" height="8" rx="4" className="fill-background" />
        <text
          x="280"
          y="138.6"
          fontSize="3.6"
          textAnchor="middle"
          className="fill-secondary-foreground"
        >
          Precio especial
        </text>
        <rect x="277" y="154" width="50" height="14" rx="4" className="fill-primary" />
        <Check x={282} y={157.5} width={6} height={6} className="stroke-primary-foreground" />
        <text x="291" y="162.6" fontSize="5.2" fontWeight="500" className="fill-primary-foreground">
          Reservar
        </text>
      </g>

      <g className="hero-d-confirm">
        <rect
          x="197"
          y="118"
          width="130"
          height="30"
          rx="5"
          strokeWidth="1"
          className="fill-primary/10 stroke-primary/30"
        />
        <CheckCircle2 x={204} y={126} width={9} height={9} className="stroke-primary" />
        <text x="217" y="129.6" fontSize="5.6" fontWeight="600" className="fill-foreground">
          Reserva confirmada
        </text>
        <text x="217" y="137" fontSize="3.8" className="fill-muted-foreground">
          Te esperamos en Complejo Oeste.
        </text>
      </g>
    </g>
  )
}
