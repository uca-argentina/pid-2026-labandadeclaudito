import {
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
  Trophy,
  X,
} from 'lucide-react'
import { SoccerBall } from './balls'
import { CardBox, CourtStrip } from './screen-parts'

// Pantalla de la laptop: la web app real vista en escritorio, dibujada con los
// mismos textos y la misma estructura que el front (sidebar verde del jugador
// con el contenido en una "hoja" encima, "Buscar canchas", panel de filtros
// con el select de Deporte, card de cancha con "Reservar" y panel de reserva
// con los días, los horarios y el resumen con la seña).
// Las coordenadas son las de la pantalla de la laptop (x 63–337, y 25–181).
// Cada pieza que cambia con el tiempo es un <g> con su clase hero-d-* (ver
// login-hero.css, bloque "Grupo A: laptop").
// OJO al mover cosas: el cursor va a puntos fijos de la pantalla (ver
// @keyframes hero-cursor). Tienen que seguir cayendo adentro de: el botón
// "Filtros" (147, 64), el select de Deporte (270, 109) y sus opciones (una cada
// 7,4 desde y = 121,7), "Ver resultados" (285, 168), el "Reservar" de la
// cancha (293, 119), el horario 21:00 (208, 101) y el "Reservar" del panel
// (298, 159).
const SPORT_OPTIONS = ['Todos', 'Fútbol 5', 'Fútbol 7', 'Fútbol 11', 'Tenis', 'Pádel', 'Básquet']

const COMPLEXES = [
  {
    x: 131,
    name: 'Complejo Oeste',
    address: 'Rivadavia 4500 · Caballito',
    courts: '3 canchas',
    sports: ['Fútbol 5', 'Fútbol 7'],
    price: '$18.000',
    photoClass: 'fill-primary/45',
  },
  {
    x: 199,
    name: 'Club Palermo',
    address: 'Soler 3800 · Palermo',
    courts: '2 canchas',
    sports: ['Pádel', 'Tenis'],
    price: '$24.000',
    photoClass: 'fill-hero-padel/45',
  },
  {
    x: 267,
    name: 'Club Belgrano',
    address: 'Cabildo 900 · Belgrano',
    courts: '4 canchas',
    sports: ['Básquet', 'Tenis'],
    price: '$15.000',
    photoClass: 'fill-hero-orange/45',
  },
]

// Tira de días del panel de reserva: el partido es el sábado 3
const DAYS = [
  { name: 'Hoy', number: 1 },
  { name: 'Mañana', number: 2 },
  { name: 'Sáb', number: 3 },
  { name: 'Dom', number: 4 },
  { name: 'Lun', number: 5 },
  { name: 'Mar', number: 6 },
]
const CHOSEN_DAY = 3

// special: turno con precio distinto al base (el front le muestra el precio)
const SLOT_COLUMNS = [197, 229, 261, 293]
const SLOTS = [
  { time: '17:00', x: SLOT_COLUMNS[0], y: 76, free: true, special: false },
  { time: '18:00', x: SLOT_COLUMNS[1], y: 76, free: false, special: false },
  { time: '19:00', x: SLOT_COLUMNS[2], y: 76, free: true, special: false },
  { time: '20:00', x: SLOT_COLUMNS[3], y: 76, free: true, special: true },
  { time: '21:00', x: SLOT_COLUMNS[0], y: 95, free: true, special: true },
  { time: '22:00', x: SLOT_COLUMNS[1], y: 95, free: true, special: true },
  { time: '23:00', x: SLOT_COLUMNS[2], y: 95, free: false, special: true },
  { time: '00:00', x: SLOT_COLUMNS[3], y: 95, free: true, special: true },
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
        <clipPath id="hero-d-cover">
          <rect x="131" y="31" width="196" height="42" rx="7" />
        </clipPath>
      </defs>

      <g clipPath="url(#hero-d-screen)">
        {/* El verde del sidebar de fondo y, encima, la "hoja" del contenido
            con las esquinas de la izquierda redondeadas */}
        <rect x="63" y="25" width="274" height="156" className="fill-sidebar" />
        <rect x="121" y="25" width="230" height="156" rx="7" className="fill-background" />
        <Sidebar />

        <g className="hero-d-list">
          <ListPage />
        </g>
        <g className="hero-d-detail">
          <DetailPage />
        </g>

        <g className="hero-d-scrim1">
          <rect x="63" y="25" width="274" height="156" className="fill-black/35" />
        </g>
        <g className="hero-d-sheet1">
          <FilterSheet />
        </g>

        <g className="hero-d-scrim2">
          <rect x="63" y="25" width="274" height="156" className="fill-black/35" />
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
      <SoccerBall cx={73} cy={37} r={4.6} />
      <text
        x="81"
        y="39.5"
        fontSize="6.4"
        fontWeight="800"
        className="font-brand fill-sidebar-foreground"
      >
        Toca<tspan className="fill-sidebar-primary">Y</tspan>Juga
      </text>

      {items.map((item) => (
        <g key={item.label}>
          {item.active && (
            <rect x="67" y={item.y} width="50" height="11" rx="4" className="fill-sidebar-accent" />
          )}
          <item.Icon
            x={71}
            y={item.y + 3}
            width={5}
            height={5}
            className={item.active ? 'stroke-sidebar-primary' : 'stroke-sidebar-foreground/80'}
          />
          <text
            x="79"
            y={item.y + 7.4}
            fontSize="4.8"
            fontWeight={item.active ? 600 : 400}
            className={item.active ? 'fill-sidebar-foreground' : 'fill-sidebar-foreground/80'}
          >
            {item.label}
          </text>
        </g>
      ))}

      {/* Tarjeta del perfil */}
      <rect x="66" y="157" width="52" height="20" rx="5" className="fill-sidebar-accent" />
      <circle cx="75" cy="167" r="5.5" className="fill-sidebar-primary" />
      <text
        x="75"
        y="168.5"
        fontSize="4"
        fontWeight="700"
        textAnchor="middle"
        className="font-heading fill-sidebar-primary-foreground"
      >
        JP
      </text>
      <text x="83.5" y="166" fontSize="4.4" fontWeight="600" className="fill-sidebar-foreground">
        Juan Pérez
      </text>
      <text
        x="83.5"
        y="171.6"
        fontSize="3.4"
        textDecoration="underline"
        className="fill-sidebar-foreground/70"
      >
        Cerrar sesión
      </text>
    </g>
  )
}

function ListPage() {
  return (
    <g>
      <text x="131" y="45" fontSize="10" fontWeight="700" className="font-heading fill-foreground">
        Buscar canchas
      </text>
      <text x="131" y="53" fontSize="4.2" className="fill-muted-foreground">
        Decinos dónde y cuándo querés jugar, y te mostramos qué hay libre.
      </text>

      <CardBox x={131} y={60} width={40} height={13} rx={4.5} />
      <SlidersHorizontal x={136} y={63.5} width={6} height={6} className="stroke-foreground" />
      <text x="145" y="68.6" fontSize="5.6" fontWeight="600" className="fill-foreground">
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
      <CardBox x={x} y={y} width={60} height={92} rx={6} />

      {/* La foto de portada, con los deportes del complejo encima */}
      <path
        d={`M${x} ${y + 40} V${y + 6} a6 6 0 0 1 6 -6 H${x + 54} a6 6 0 0 1 6 6 V${y + 40} Z`}
        className={complex.photoClass}
      />
      <rect
        x={x + 8}
        y={y + 6}
        width="44"
        height="20"
        rx="1.5"
        strokeWidth="0.8"
        className="stroke-hero-line/70 fill-none"
      />
      <line
        x1={x + 30}
        y1={y + 6}
        x2={x + 30}
        y2={y + 26}
        strokeWidth="0.8"
        className="stroke-hero-line/70"
      />
      {complex.sports.map((sport, index) => (
        <g key={sport}>
          <rect
            x={x + 4 + index * 23}
            y={y + 30}
            width="21"
            height="7"
            rx="3.5"
            className="fill-card"
          />
          <text
            x={x + 14.5 + index * 23}
            y={y + 34.9}
            fontSize="3.3"
            fontWeight="600"
            textAnchor="middle"
            className="fill-card-foreground"
          >
            {sport}
          </text>
        </g>
      ))}

      <text
        x={x + 6}
        y={y + 50.5}
        fontSize="5.8"
        fontWeight="700"
        className="font-heading fill-card-foreground"
      >
        {complex.name}
      </text>
      <text x={x + 6} y={y + 57} fontSize="3.3" className="fill-muted-foreground">
        {complex.address}
      </text>

      <text x={x + 6} y={y + 76} fontSize="3.3" className="fill-muted-foreground">
        desde
      </text>
      <text
        x={x + 6}
        y={y + 84.5}
        fontSize="6.6"
        fontWeight="700"
        className="font-heading fill-primary"
      >
        {complex.price}
      </text>
      <rect x={x + 37} y={y + 78.5} width="18.5" height="7" rx="3.5" className="fill-muted" />
      <text
        x={x + 46.25}
        y={y + 83.3}
        fontSize="3.1"
        fontWeight="500"
        textAnchor="middle"
        className="fill-foreground"
      >
        {complex.courts}
      </text>
    </g>
  )
}

function DetailPage() {
  return (
    <g>
      {/* Portada del complejo: el nombre va escrito sobre la foto */}
      <rect x="131" y="31" width="196" height="42" rx="7" className="fill-sidebar" />
      <g clipPath="url(#hero-d-cover)" strokeWidth="0.8" className="stroke-hero-line/20 fill-none">
        <rect x="238" y="37" width="110" height="30" />
        <line x1="293" y1="37" x2="293" y2="67" />
        <circle cx="293" cy="52" r="8" />
        <rect x="238" y="44" width="14" height="16" />
      </g>
      <rect x="138" y="37" width="25" height="7" rx="3.5" className="fill-highlight" />
      <text
        x="150.5"
        y="41.9"
        fontSize="3.4"
        fontWeight="700"
        textAnchor="middle"
        className="fill-highlight-foreground"
      >
        Verificado
      </text>
      <text
        x="138"
        y="57.5"
        fontSize="10"
        fontWeight="700"
        className="font-heading fill-sidebar-foreground"
      >
        Complejo Oeste
      </text>
      <MapPin x={138} y={61.3} width={4.5} height={4.5} className="stroke-sidebar-foreground/80" />
      <text x="144.5" y="65.2" fontSize="4.2" className="fill-sidebar-foreground/80">
        Rivadavia 4500 · Caballito
      </text>

      <text
        x="132"
        y="83.5"
        fontSize="6.4"
        fontWeight="700"
        className="font-heading fill-foreground"
      >
        Elegí tu cancha
      </text>

      <CourtCard y={88} sport="FÚTBOL 5 · SINTÉTICO" name="Cancha 1" />
      <CourtCard y={157} sport="FÚTBOL 7 · SINTÉTICO" name="Cancha 2" />
    </g>
  )
}

// Card de una cancha: la franja en diagonal con el dibujo de la cancha, los
// datos y, a la derecha, el precio pegado al botón.
function CourtCard({ y, sport, name }: { y: number; sport: string; name: string }) {
  return (
    <g>
      <CardBox x={131} y={y} width={196} height={62} rx={8} />
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

      <text
        x="168"
        y={y + 23}
        fontSize="3.6"
        fontWeight="700"
        letterSpacing="0.2"
        className="fill-primary"
      >
        {sport}
      </text>
      <text
        x="168"
        y={y + 33.5}
        fontSize="8.5"
        fontWeight="700"
        className="font-heading fill-card-foreground"
      >
        {name}
      </text>
      <Clock x={168} y={y + 37.5} width={4} height={4} className="stroke-muted-foreground" />
      <text x="174" y={y + 41} fontSize="3.8" className="fill-muted-foreground">
        08:00 a 24:00 hs
      </text>

      <text x="228" y={y + 23} fontSize="3.4" className="fill-muted-foreground">
        desde
      </text>
      <text
        x="228"
        y={y + 33.5}
        fontSize="8.5"
        fontWeight="700"
        className="font-heading fill-primary"
      >
        $18.000
      </text>
      <text x="228" y={y + 40.5} fontSize="3.2" className="fill-muted-foreground">
        por turno de 60 min
      </text>

      <rect x="275" y={y + 24} width="44" height="14" rx="5" className="fill-primary" />
      <CalendarPlus
        x={279.5}
        y={y + 28}
        width={6}
        height={6}
        className="stroke-primary-foreground"
      />
      <text
        x="288.5"
        y={y + 33}
        fontSize="5.4"
        fontWeight="600"
        className="fill-primary-foreground"
      >
        Reservar
      </text>
    </g>
  )
}

function FilterSheet() {
  return (
    <g>
      <rect x="187" y="25" width="150" height="156" className="fill-background" />
      <circle cx="326" cy="36" r="5.5" className="fill-secondary" />
      <X x={323} y={33} width={6} height={6} className="stroke-foreground" />
      <text x="197" y="40" fontSize="8.5" fontWeight="700" className="font-heading fill-foreground">
        Filtros
      </text>
      <text x="197" y="48" fontSize="4" className="fill-muted-foreground">
        Combiná los que quieras para encontrar tu cancha.
      </text>
      <text x="197" y="63" fontSize="6" fontWeight="600" className="fill-foreground">
        Cancha
      </text>

      <MapPin x={197} y={67.5} width={4.5} height={4.5} className="stroke-foreground" />
      <text x="203" y="71.5" fontSize="4.6" fontWeight="600" className="fill-foreground">
        Zona
      </text>
      <rect
        x="197"
        y="75"
        width="130"
        height="13"
        rx="4.5"
        strokeWidth="1"
        className="fill-card stroke-border"
      />
      <text x="203" y="83.3" fontSize="5" className="fill-foreground">
        Todas
      </text>
      <ChevronDown x={316} y={78.5} width={6} height={6} className="stroke-muted-foreground" />

      <Trophy x={197} y={93.5} width={4.5} height={4.5} className="stroke-foreground" />
      <text x="203" y="97.5" fontSize="4.6" fontWeight="600" className="fill-foreground">
        Deporte
      </text>
      <rect
        x="197"
        y="102"
        width="130"
        height="14"
        rx="4.5"
        strokeWidth="1"
        className="fill-card stroke-border"
      />
      <text x="203" y="110.6" fontSize="5" className="hero-d-val-all fill-foreground">
        Todos
      </text>
      <text x="203" y="110.6" fontSize="5" className="hero-d-val-f5 fill-foreground">
        Fútbol 5
      </text>
      <ChevronDown x={316} y={106} width={6} height={6} className="stroke-muted-foreground" />

      <g className="hero-d-surf">
        <text x="203" y="127.5" fontSize="4.6" fontWeight="600" className="fill-foreground">
          Superficie
        </text>
        <rect
          x="197"
          y="131"
          width="130"
          height="14"
          rx="4.5"
          strokeWidth="1"
          className="fill-card stroke-border"
        />
        <text x="203" y="139.6" fontSize="5" className="fill-foreground">
          Todas
        </text>
        <ChevronDown x={316} y={135} width={6} height={6} className="stroke-muted-foreground" />
      </g>

      {/* Pie del panel, fijo abajo */}
      <rect x="187" y="159" width="150" height="22" className="fill-card" />
      <line x1="187" y1="159" x2="337" y2="159" strokeWidth="1" className="stroke-border" />
      <text x="238" y="172.6" fontSize="5" fontWeight="600" className="fill-foreground">
        Limpiar
      </text>
      <rect x="262" y="164" width="65" height="13" rx="4.5" className="fill-primary" />
      <Search x={266} y={167.5} width={6} height={6} className="stroke-primary-foreground" />
      <text x="275" y="172.6" fontSize="5" fontWeight="600" className="fill-primary-foreground">
        Ver resultados
      </text>

      {/* Lista del select de Deporte con las 6 opciones reales + "Todos" */}
      <g className="hero-d-dd">
        <CardBox x={197} y={118} width={130} height={52} rx={4} />
        <rect
          x="197"
          y="118"
          width="130"
          height="52"
          rx="4"
          strokeWidth="0.6"
          className="stroke-border fill-none"
        />
        <rect
          x="198.5"
          y="118.6"
          width="127"
          height="7.2"
          rx="2.5"
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
      <rect x="187" y="25" width="150" height="156" className="fill-background" />
      <CourtStrip x={187} y={25} width={150} height={12} sport="futbol" />
      <circle cx="327" cy="35" r="5.5" className="fill-secondary" />
      <X x={324} y={32} width={6} height={6} className="stroke-foreground" />

      <text
        x="197"
        y="47.5"
        fontSize="8.5"
        fontWeight="700"
        className="font-heading fill-foreground"
      >
        Cancha 1
      </text>
      <rect x="197" y="50" width="21" height="6.4" rx="3.2" className="fill-primary/15" />
      <text
        x="207.5"
        y="54.5"
        fontSize="3.3"
        fontWeight="600"
        textAnchor="middle"
        className="fill-primary"
      >
        Fútbol 5
      </text>
      <Clock x={221.5} y={51.2} width={4} height={4} className="stroke-muted-foreground" />
      <text x="227" y="54.6" fontSize="3.5" className="fill-muted-foreground">
        Turnos de 60 min · Precio base $18.000
      </text>

      {/* Tira de días: el elegido va en verde */}
      {DAYS.map((day, index) => {
        const x = 197 + index * 22.2
        const chosen = day.number === CHOSEN_DAY
        return (
          <g key={day.number}>
            <CardBox
              x={x}
              y={58.5}
              width={19}
              height={14.5}
              rx={4.5}
              className={chosen ? 'fill-primary' : 'fill-card'}
            />
            <text
              x={x + 9.5}
              y={63.4}
              fontSize="3"
              fontWeight="500"
              textAnchor="middle"
              className={chosen ? 'fill-primary-foreground' : 'fill-foreground'}
            >
              {day.name}
            </text>
            <text
              x={x + 9.5}
              y={70.6}
              fontSize="6.4"
              fontWeight="700"
              textAnchor="middle"
              className={
                chosen ? 'font-heading fill-primary-foreground' : 'font-heading fill-foreground'
              }
            >
              {day.number}
            </text>
          </g>
        )
      })}

      {SLOTS.map((slot) => (
        <g key={slot.time}>
          {slot.free ? (
            <CardBox x={slot.x} y={slot.y} width={28} height={15} rx={4.5} />
          ) : (
            <rect x={slot.x} y={slot.y} width="28" height="15" rx="4.5" className="fill-muted" />
          )}
          <text
            x={slot.x + 14}
            y={slot.free && slot.special ? slot.y + 7.4 : slot.y + 9.4}
            fontSize="5.4"
            fontWeight="600"
            textAnchor="middle"
            textDecoration={slot.free ? undefined : 'line-through'}
            className={slot.free ? 'fill-foreground' : 'fill-muted-foreground/60'}
          >
            {slot.time}
          </text>
          {slot.free && slot.special && (
            <text
              x={slot.x + 14}
              y={slot.y + 12.4}
              fontSize="3.2"
              textAnchor="middle"
              className="fill-muted-foreground"
            >
              $22.000
            </text>
          )}
        </g>
      ))}

      {/* Horario elegido (21:00) */}
      <g className="hero-d-slot">
        <rect x="197" y="95" width="28" height="15" rx="4.5" className="fill-primary" />
        <text
          x="211"
          y="102.4"
          fontSize="5.4"
          fontWeight="700"
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

      {/* Pie del panel: el resumen con la seña y el botón */}
      <g className="hero-d-summary">
        <rect x="187" y="113.2" width="150" height="80" rx="8" className="fill-black/5" />
        <rect x="187" y="114" width="150" height="80" rx="8" className="fill-card" />
        <text
          x="197"
          y="125"
          fontSize="5.2"
          fontWeight="700"
          className="font-heading fill-card-foreground"
        >
          Sábado 3 de octubre · 21:00 a 22:00 hs
        </text>
        <SummaryLine y={132.6} label="Precio del turno (precio especial)" value="$22.000" />
        <SummaryLine y={138.4} label="Seña del 30% para confirmar" value="$6.600" strong />
        <SummaryLine y={144.2} label="El resto se paga en la cancha" value="$15.400" />

        <rect x="197" y="149" width="130" height="18" rx="5.5" className="fill-primary" />
        <Check x={246.5} y={154.8} width={6.4} height={6.4} className="stroke-primary-foreground" />
        <text
          x="255.5"
          y="160.2"
          fontSize="5.8"
          fontWeight="600"
          className="fill-primary-foreground"
        >
          Reservar
        </text>
      </g>

      <g className="hero-d-confirm">
        <rect x="187" y="113.2" width="150" height="80" rx="8" className="fill-black/5" />
        <rect x="187" y="114" width="150" height="80" rx="8" className="fill-card" />
        <CheckCircle2 x={197} y={121.5} width={11} height={11} className="stroke-primary" />
        <text x="212" y="127" fontSize="5.8" fontWeight="600" className="fill-card-foreground">
          Reserva confirmada
        </text>
        <text x="212" y="134" fontSize="3.9" className="fill-muted-foreground">
          Cancha 1 a las 21:00 hs — seña de $6.600 pagada.
        </text>
        <text x="212" y="142.5" fontSize="4.4" fontWeight="500" className="fill-primary">
          Ver mis reservas →
        </text>
      </g>
    </g>
  )
}

// Un renglón del desglose: qué es a la izquierda y cuánto a la derecha.
// strong: el renglón de la seña, que es lo que se paga ahora.
function SummaryLine({
  y,
  label,
  value,
  strong = false,
}: {
  y: number
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <>
      <text
        x="197"
        y={y}
        fontSize="3.9"
        fontWeight={strong ? 600 : 400}
        className={strong ? 'fill-card-foreground' : 'fill-muted-foreground'}
      >
        {label}
      </text>
      <text
        x="327"
        y={y}
        fontSize="3.9"
        fontWeight={strong ? 600 : 400}
        textAnchor="end"
        className={strong ? 'fill-primary' : 'fill-muted-foreground'}
      >
        {value}
      </text>
    </>
  )
}
