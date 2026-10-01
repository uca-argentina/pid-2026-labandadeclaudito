import { CalendarDays, Check, CheckCircle2, ChevronDown, MapPin, Trophy, X } from 'lucide-react'

// Pantalla del celular: la web app real en mobile. Mismos textos y estructura
// que el front: panel de Filtros (full width) con el select de Deporte, que en
// el celular se abre como un selector de rueda, y panel de reserva con la
// grilla de horarios de la cancha.
// Todos los toques caen en el mismo punto (222, 174), donde apoya el pulgar: el
// select, la opción de la rueda, el horario y el botón "Reservar" están
// ubicados ahí (el panel se desplaza antes de cada toque, como en un
// celular de verdad). Coordenadas de la pantalla del celular (x 156–244, y 62–262).
const SPORT_OPTIONS = ['Todos', 'Fútbol 5', 'Fútbol 7', 'Fútbol 11', 'Tenis', 'Pádel', 'Básquet']

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
      <X x={231} y={67} width={7} height={7} className="stroke-muted-foreground" />
      <text x="164" y="80" fontSize="8" fontWeight="600" className="fill-foreground">
        Filtros
      </text>
      <text x="164" y="88" fontSize="3.6" className="fill-muted-foreground">
        Combiná los que quieras para
      </text>
      <text x="164" y="93" fontSize="3.6" className="fill-muted-foreground">
        encontrar tu cancha.
      </text>
      <text x="164" y="112" fontSize="5.6" fontWeight="600" className="fill-foreground">
        Cancha
      </text>

      <MapPin x={164} y={118} width={4} height={4} className="stroke-foreground" />
      <text x="170" y="121.6" fontSize="4.4" fontWeight="500" className="fill-foreground">
        Zona
      </text>
      <rect
        x="164"
        y="125"
        width="72"
        height="13"
        rx="3"
        strokeWidth="1"
        className="fill-background stroke-border"
      />
      <text x="169" y="133.3" fontSize="4.6" className="fill-foreground">
        Todas
      </text>
      <ChevronDown x={228} y={128} width={6} height={6} className="stroke-muted-foreground" />

      <Trophy x={164} y={152} width={4} height={4} className="stroke-foreground" />
      <text x="170" y="155.6" fontSize="4.4" fontWeight="500" className="fill-foreground">
        Deporte
      </text>
      <rect
        x="164"
        y="167"
        width="72"
        height="14"
        rx="3"
        strokeWidth="1"
        className="fill-background stroke-border"
      />
      <text x="169" y="175.6" fontSize="4.8" className="hero-m-val-all fill-foreground">
        Todos
      </text>
      <text x="169" y="175.6" fontSize="4.8" className="hero-m-val-pad fill-foreground">
        Pádel
      </text>
      <ChevronDown x={228} y={171} width={6} height={6} className="stroke-muted-foreground" />

      <g className="hero-m-surf">
        <text x="170" y="195" fontSize="4.4" fontWeight="500" className="fill-foreground">
          Superficie
        </text>
        <rect
          x="164"
          y="199"
          width="72"
          height="13"
          rx="3"
          strokeWidth="1"
          className="fill-background stroke-border"
        />
        <text x="169" y="207.3" fontSize="4.6" className="fill-foreground">
          Todas
        </text>
      </g>

      <line x1="156" y1="236" x2="244" y2="236" strokeWidth="1" className="stroke-border" />
      <text x="164" y="250" fontSize="4.2" className="fill-foreground">
        Limpiar filtros
      </text>
      <rect x="194" y="241" width="42" height="14" rx="3.5" className="fill-primary" />
      <text
        x="215"
        y="250"
        fontSize="4.2"
        fontWeight="500"
        textAnchor="middle"
        className="fill-primary-foreground"
      >
        Ver resultados
      </text>

      {/* Selector de rueda: las opciones pasan por la franja del medio
          (y = 174) y queda elegida la que frena ahí. */}
      <g className="hero-m-popup">
        <rect x="156" y="62" width="88" height="200" className="fill-foreground/30" />
        <rect
          x="164"
          y="124"
          width="72"
          height="100"
          rx="8"
          strokeWidth="1"
          className="fill-card stroke-border"
        />
        <rect x="168" y="167.8" width="64" height="12.4" rx="3" className="fill-primary/20" />
        <g clipPath="url(#hero-m-wheel-clip)">
          <g className="hero-m-wheel">
            {SPORT_OPTIONS.map((option, index) => (
              <text
                key={option}
                x="200"
                y={175.6 + index * 11.5}
                fontSize="5.2"
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
        <X x={231} y={67} width={7} height={7} className="stroke-muted-foreground" />
        <text x="164" y="80" fontSize="8" fontWeight="600" className="fill-foreground">
          Cancha 2
        </text>
        <text x="164" y="88" fontSize="3.6" className="fill-muted-foreground">
          Pádel · Precio base $24.000 por
        </text>
        <text x="164" y="93" fontSize="3.6" className="fill-muted-foreground">
          turno de 90 min.
        </text>

        <CalendarDays x={164} y={102} width={4.5} height={4.5} className="stroke-foreground" />
        <text x="170" y="106" fontSize="4.4" fontWeight="500" className="fill-foreground">
          Fecha
        </text>
        <rect
          x="188"
          y="100"
          width="48"
          height="11"
          rx="3"
          strokeWidth="1"
          className="fill-background stroke-border"
        />
        <text x="192" y="107.4" fontSize="4.2" className="fill-foreground">
          04/10/2026
        </text>

        {SLOT_ROWS.map((row) =>
          row.times.map((time, index) => {
            const free = !BUSY_TIMES.includes(time)
            return (
              <g key={time}>
                <rect
                  x={SLOT_COLUMNS[index]}
                  y={row.y}
                  width="22"
                  height="14"
                  rx="3"
                  strokeWidth="1"
                  className={free ? 'fill-background stroke-border' : 'fill-muted stroke-border'}
                />
                <text
                  x={SLOT_COLUMNS[index] + 11}
                  y={row.y + 6.4}
                  fontSize="4.6"
                  fontWeight="500"
                  textAnchor="middle"
                  className={free ? 'fill-foreground' : 'fill-muted-foreground/60'}
                >
                  {time}
                </text>
                <text
                  x={SLOT_COLUMNS[index] + 11}
                  y={row.y + 11.2}
                  fontSize="2.8"
                  textAnchor="middle"
                  className="fill-muted-foreground"
                >
                  $24.000
                </text>
              </g>
            )
          }),
        )}

        {/* Horario elegido (20:00): bajo el pulgar */}
        <g className="hero-m-slot">
          <rect x="214" y="167" width="22" height="14" rx="3" className="fill-primary" />
          <text
            x="225"
            y="173.4"
            fontSize="4.6"
            fontWeight="500"
            textAnchor="middle"
            className="fill-primary-foreground"
          >
            20:00
          </text>
          <text
            x="225"
            y="178.2"
            fontSize="2.8"
            textAnchor="middle"
            className="fill-primary-foreground/80"
          >
            $24.000
          </text>
        </g>

        <g className="hero-m-summary">
          <rect
            x="164"
            y="203"
            width="72"
            height="26"
            rx="4"
            strokeWidth="1"
            className="fill-secondary stroke-border"
          />
          <text x="169" y="212" fontSize="4.4" fontWeight="500" className="fill-foreground">
            20:00 a 21:30 hs
          </text>
          <text x="169" y="221" fontSize="3.8" className="fill-muted-foreground">
            Precio del turno:
          </text>
          <text x="196" y="221" fontSize="4.2" fontWeight="600" className="fill-foreground">
            $24.000
          </text>
          <rect x="190" y="235" width="46" height="14" rx="3.5" className="fill-primary" />
          <Check x={195} y={238.5} width={6} height={6} className="stroke-primary-foreground" />
          <text
            x="204"
            y="243.6"
            fontSize="4.6"
            fontWeight="500"
            className="fill-primary-foreground"
          >
            Reservar
          </text>
        </g>

        <g className="hero-m-confirm">
          <rect
            x="164"
            y="203"
            width="72"
            height="30"
            rx="4"
            strokeWidth="1"
            className="fill-primary/10 stroke-primary/30"
          />
          <CheckCircle2 x={169} y={210} width={8} height={8} className="stroke-primary" />
          <text x="180" y="213.6" fontSize="4.6" fontWeight="600" className="fill-foreground">
            Reserva confirmada
          </text>
          <text x="180" y="221" fontSize="3.2" className="fill-muted-foreground">
            Te esperamos en
          </text>
          <text x="180" y="226" fontSize="3.2" className="fill-muted-foreground">
            Club Palermo.
          </text>
        </g>
      </g>
    </g>
  )
}
