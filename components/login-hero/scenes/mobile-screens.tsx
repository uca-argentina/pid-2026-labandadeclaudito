import { Check, CheckCircle2, ChevronDown, Clock, MapPin, Trophy, X } from 'lucide-react'
import { CardBox, CourtStrip } from './screen-parts'

// Pantalla del celular: la web app real en mobile. Mismos textos y estructura
// que el front: panel de Filtros (full width) con el select de Deporte, que en
// el celular se abre como un selector de rueda, y panel de reserva con los
// días, los horarios de la cancha y el resumen con la seña.
// Todos los toques caen en el mismo punto (222, 174), donde apoya el pulgar: el
// select, la opción de la rueda, el horario y el botón "Reservar" están
// ubicados ahí (el panel se desplaza antes de cada toque, como en un
// celular de verdad). Coordenadas de la pantalla del celular (x 156–244, y 62–262).
const SPORT_OPTIONS = ['Todos', 'Fútbol 5', 'Fútbol 7', 'Fútbol 11', 'Tenis', 'Pádel', 'Básquet']

// Tira de días del panel de reserva: el partido es el domingo 4
const DAYS = [
  { name: 'Hoy', number: 2 },
  { name: 'Mañana', number: 3 },
  { name: 'Dom', number: 4 },
  { name: 'Lun', number: 5 },
]
const CHOSEN_DAY = 4

const SLOT_COLUMNS = [164, 189, 214]
const SLOT_ROWS = [
  { y: 131, times: ['08:00', '09:30', '11:00'] },
  { y: 149, times: ['12:30', '14:00', '15:30'] },
  { y: 167, times: ['17:00', '18:30', '20:00'] },
  { y: 185, times: ['21:30', '23:00'] },
]
const BUSY_TIMES = ['09:30', '15:30']

export function MobileScreens() {
  return (
    <>
      <defs>
        <clipPath id="hero-m-screen">
          <rect x="156" y="62" width="88" height="200" rx="9" />
        </clipPath>
        <clipPath id="hero-m-wheel-clip">
          <rect x="168" y="128" width="64" height="92" />
        </clipPath>
      </defs>

      <g clipPath="url(#hero-m-screen)">
        <rect x="156" y="62" width="88" height="200" className="fill-background" />

        <g className="hero-m-sheet1">
          <FilterSheet />
        </g>
        <g className="hero-m-sheet2">
          <BookingSheet />
        </g>
      </g>
    </>
  )
}

function FilterSheet() {
  return (
    <g>
      <rect x="156" y="62" width="88" height="200" className="fill-background" />
      <circle cx="233" cy="77" r="5.5" className="fill-secondary" />
      <X x={230} y={74} width={6} height={6} className="stroke-foreground" />
      <text x="164" y="81" fontSize="8.5" fontWeight="700" className="font-heading fill-foreground">
        Filtros
      </text>
      <text x="164" y="89" fontSize="3.6" className="fill-muted-foreground">
        Combiná los que quieras para
      </text>
      <text x="164" y="94" fontSize="3.6" className="fill-muted-foreground">
        encontrar tu cancha.
      </text>
      <text x="164" y="112" fontSize="5.6" fontWeight="600" className="fill-foreground">
        Cancha
      </text>

      <MapPin x={164} y={118} width={4} height={4} className="stroke-foreground" />
      <text x="170" y="121.6" fontSize="4.4" fontWeight="600" className="fill-foreground">
        Zona
      </text>
      <rect
        x="164"
        y="125"
        width="72"
        height="13"
        rx="4.5"
        strokeWidth="1"
        className="fill-card stroke-border"
      />
      <text x="169.5" y="133.3" fontSize="4.6" className="fill-foreground">
        Todas
      </text>
      <ChevronDown x={227} y={128.5} width={6} height={6} className="stroke-muted-foreground" />

      <Trophy x={164} y={152} width={4} height={4} className="stroke-foreground" />
      <text x="170" y="155.6" fontSize="4.4" fontWeight="600" className="fill-foreground">
        Deporte
      </text>
      <rect
        x="164"
        y="167"
        width="72"
        height="14"
        rx="4.5"
        strokeWidth="1"
        className="fill-card stroke-border"
      />
      <text x="169.5" y="175.6" fontSize="4.8" className="hero-m-val-all fill-foreground">
        Todos
      </text>
      <text x="169.5" y="175.6" fontSize="4.8" className="hero-m-val-pad fill-foreground">
        Pádel
      </text>
      <ChevronDown x={227} y={171} width={6} height={6} className="stroke-muted-foreground" />

      <g className="hero-m-surf">
        <text x="170" y="195" fontSize="4.4" fontWeight="600" className="fill-foreground">
          Superficie
        </text>
        <rect
          x="164"
          y="199"
          width="72"
          height="13"
          rx="4.5"
          strokeWidth="1"
          className="fill-card stroke-border"
        />
        <text x="169.5" y="207.3" fontSize="4.6" className="fill-foreground">
          Todas
        </text>
        <ChevronDown x={227} y={202.5} width={6} height={6} className="stroke-muted-foreground" />
      </g>

      {/* Pie del panel, fijo abajo */}
      <rect x="156" y="236" width="88" height="26" className="fill-card" />
      <line x1="156" y1="236" x2="244" y2="236" strokeWidth="1" className="stroke-border" />
      <text x="170" y="250" fontSize="4.4" fontWeight="600" className="fill-foreground">
        Limpiar
      </text>
      <rect x="192" y="241" width="44" height="14" rx="4.5" className="fill-primary" />
      <text
        x="214"
        y="249.8"
        fontSize="4.4"
        fontWeight="600"
        textAnchor="middle"
        className="fill-primary-foreground"
      >
        Ver resultados
      </text>

      {/* Selector de rueda: las opciones pasan por la franja del medio
          (y = 174) y queda elegida la que frena ahí. */}
      <g className="hero-m-popup">
        <rect x="156" y="62" width="88" height="200" className="fill-black/35" />
        <CardBox x={164} y={124} width={72} height={100} rx={9} />
        <rect x="168" y="167.8" width="64" height="12.4" rx="4" className="fill-primary/20" />
        <g clipPath="url(#hero-m-wheel-clip)">
          <g className="hero-m-wheel">
            {SPORT_OPTIONS.map((option, index) => (
              <text
                key={option}
                x="200"
                y={175.6 + index * 11.5}
                fontSize="5.2"
                fontWeight="500"
                textAnchor="middle"
                className="fill-foreground"
              >
                {option}
              </text>
            ))}
          </g>
        </g>
      </g>
    </g>
  )
}

function BookingSheet() {
  return (
    <g>
      <rect x="156" y="62" width="88" height="200" className="fill-background" />
      <g className="hero-m-scroll">
        <CourtStrip x={156} y={62} width={88} height={15} sport="padel" />
        <circle cx="234" cy="74.5" r="5.5" className="fill-secondary" />
        <X x={231} y={71.5} width={6} height={6} className="stroke-foreground" />

        <text
          x="164"
          y="88.5"
          fontSize="8.5"
          fontWeight="700"
          className="font-heading fill-foreground"
        >
          Cancha 2
        </text>
        <rect x="164" y="91.5" width="15" height="6.4" rx="3.2" className="fill-hero-padel/15" />
        <text
          x="171.5"
          y="96"
          fontSize="3.3"
          fontWeight="600"
          textAnchor="middle"
          className="fill-hero-padel"
        >
          Pádel
        </text>
        <Clock x={182} y={92.7} width={4} height={4} className="stroke-muted-foreground" />
        <text x="187.5" y="96.1" fontSize="3.5" className="fill-muted-foreground">
          Turnos de 90 min
        </text>

        {/* Tira de días: el elegido va en verde */}
        {DAYS.map((day, index) => {
          const x = 164 + index * 18.67
          const chosen = day.number === CHOSEN_DAY
          return (
            <g key={day.number}>
              <CardBox
                x={x}
                y={101.5}
                width={16}
                height={15.5}
                rx={4.5}
                className={chosen ? 'fill-primary' : 'fill-card'}
              />
              <text
                x={x + 8}
                y={106.6}
                fontSize="3"
                fontWeight="500"
                textAnchor="middle"
                className={chosen ? 'fill-primary-foreground' : 'fill-foreground'}
              >
                {day.name}
              </text>
              <text
                x={x + 8}
                y={114.2}
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

        <text x="164" y="126.8" fontSize="4.2" fontWeight="600" className="fill-foreground">
          Horarios
        </text>

        {SLOT_ROWS.map((row) =>
          row.times.map((time, index) => {
            const free = !BUSY_TIMES.includes(time)
            const x = SLOT_COLUMNS[index]
            return (
              <g key={time}>
                {free ? (
                  <CardBox x={x} y={row.y} width={22} height={14} rx={4} />
                ) : (
                  <rect x={x} y={row.y} width="22" height="14" rx="4" className="fill-muted" />
                )}
                <text
                  x={x + 11}
                  y={row.y + 8.8}
                  fontSize="4.8"
                  fontWeight="600"
                  textAnchor="middle"
                  textDecoration={free ? undefined : 'line-through'}
                  className={free ? 'fill-foreground' : 'fill-muted-foreground/60'}
                >
                  {time}
                </text>
              </g>
            )
          }),
        )}

        {/* Horario elegido (20:00): bajo el pulgar */}
        <g className="hero-m-slot">
          <rect x="214" y="167" width="22" height="14" rx="4" className="fill-primary" />
          <text
            x="225"
            y="175.8"
            fontSize="4.8"
            fontWeight="700"
            textAnchor="middle"
            className="fill-primary-foreground"
          >
            20:00
          </text>
        </g>

        {/* Pie del panel: el resumen con la seña y el botón. Es más alto que
            lo que se ve para que, al desplazarse, siga tapando hasta abajo */}
        <g className="hero-m-summary">
          <rect x="156" y="202.2" width="88" height="140" rx="9" className="fill-black/5" />
          <rect x="156" y="203" width="88" height="140" rx="9" className="fill-card" />
          <text
            x="164"
            y="213"
            fontSize="4.6"
            fontWeight="700"
            className="font-heading fill-card-foreground"
          >
            Domingo 4 · 20:00 a 21:30 hs
          </text>
          <SummaryLine y={219.6} label="Precio del turno" value="$24.000" />
          <SummaryLine y={224.6} label="Seña del 30%" value="$7.200" strong />
          <SummaryLine y={229.6} label="El resto, en la cancha" value="$16.800" />

          <rect x="164" y="234" width="72" height="16" rx="5" className="fill-primary" />
          <Check
            x={185.5}
            y={239.2}
            width={5.6}
            height={5.6}
            className="stroke-primary-foreground"
          />
          <text
            x="193.5"
            y="243.8"
            fontSize="5"
            fontWeight="600"
            className="fill-primary-foreground"
          >
            Reservar
          </text>
        </g>

        <g className="hero-m-confirm">
          <rect x="156" y="202.2" width="88" height="140" rx="9" className="fill-black/5" />
          <rect x="156" y="203" width="88" height="140" rx="9" className="fill-card" />
          <CheckCircle2 x={164} y={210} width={9} height={9} className="stroke-primary" />
          <text x="176" y="215" fontSize="4.8" fontWeight="600" className="fill-card-foreground">
            Reserva confirmada
          </text>
          <text x="176" y="221.4" fontSize="3.3" className="fill-muted-foreground">
            Cancha 2 a las 20:00 hs —
          </text>
          <text x="176" y="226" fontSize="3.3" className="fill-muted-foreground">
            seña de $7.200 pagada.
          </text>
          <text x="176" y="234" fontSize="3.9" fontWeight="500" className="fill-primary">
            Ver mis reservas →
          </text>
        </g>
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
        x="164"
        y={y}
        fontSize="3.5"
        fontWeight={strong ? 600 : 400}
        className={strong ? 'fill-card-foreground' : 'fill-muted-foreground'}
      >
        {label}
      </text>
      <text
        x="236"
        y={y}
        fontSize="3.5"
        fontWeight={strong ? 600 : 400}
        textAnchor="end"
        className={strong ? 'fill-primary' : 'fill-muted-foreground'}
      >
        {value}
      </text>
    </>
  )
}
