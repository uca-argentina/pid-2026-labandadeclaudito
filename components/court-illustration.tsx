import type { FamiliaDeDeporte } from '@/lib/dashboard'
import { PelotaDeBasquet, PelotaDeFutbol, PelotaDeTenis } from '@/components/sport-ball'

// Ilustración del bloque principal del dashboard: la cancha del deporte
// elegido vista desde arriba e inclinada (perspectiva isométrica), con los
// jugadores y la pelota en movimiento. Mismo estilo que las escenas del login
// (components/login-hero), dibujada de nuevo acá porque ese módulo no se
// importa desde afuera; las pelotas salen de sport-ball.tsx. Con "Todos" se
// ven las pelotas de los deportes del complejo flotando. Es solo decoración.

const lineas = 'stroke-hero-line/85 fill-none'

type Jugador = { x: number; y: number; equipo: 'rojo' | 'azul' }

function Jugadores({ jugadores }: { jugadores: Jugador[] }) {
  return (
    <g className="stroke-hero-line" strokeWidth="1.5">
      {jugadores.map((jugador, indice) => (
        <g
          key={indice}
          className="motion-safe:animate-saltito"
          style={{ animationDelay: `${indice * 170}ms` }}
        >
          <circle
            cx={jugador.x}
            cy={jugador.y}
            r="8"
            className={jugador.equipo === 'rojo' ? 'fill-hero-team-red' : 'fill-hero-team-blue'}
          />
        </g>
      ))}
    </g>
  )
}

function CanchaDeFutbol() {
  const franjas = [0, 2, 4, 6, 8]
  return (
    <>
      <rect x="20" y="10" width="360" height="220" rx="10" className="fill-tema-desde" />
      {/* Franjas del pasto cortado */}
      {franjas.map((franja) => (
        <rect
          key={franja}
          x={20 + franja * 40}
          y="10"
          width="40"
          height="220"
          className="fill-hero-line/10"
        />
      ))}
      <g strokeWidth="2.5" className={lineas}>
        <rect x="35" y="25" width="330" height="190" rx="2" />
        <line x1="200" y1="25" x2="200" y2="215" />
        <circle cx="200" cy="120" r="30" />
        <rect x="35" y="72" width="50" height="96" />
        <rect x="315" y="72" width="50" height="96" />
        <rect x="35" y="98" width="20" height="44" />
        <rect x="345" y="98" width="20" height="44" />
      </g>
      <circle cx="200" cy="120" r="3" className="fill-hero-line/85" />
      <rect x="25" y="104" width="10" height="32" rx="2" className="fill-hero-line/60" />
      <rect x="365" y="104" width="10" height="32" rx="2" className="fill-hero-line/60" />
      <Jugadores
        jugadores={[
          { x: 70, y: 120, equipo: 'rojo' },
          { x: 120, y: 75, equipo: 'rojo' },
          { x: 120, y: 165, equipo: 'rojo' },
          { x: 165, y: 95, equipo: 'rojo' },
          { x: 165, y: 150, equipo: 'rojo' },
          { x: 330, y: 120, equipo: 'azul' },
          { x: 280, y: 75, equipo: 'azul' },
          { x: 280, y: 165, equipo: 'azul' },
          { x: 235, y: 95, equipo: 'azul' },
          { x: 235, y: 150, equipo: 'azul' },
        ]}
      />
      <g className="motion-safe:animate-pase">
        <PelotaDeFutbol x={200} y={120} r={7} />
      </g>
    </>
  )
}

function CanchaDeTenis() {
  return (
    <>
      {/* Polvo de ladrillo: el piso sigue más allá de las líneas */}
      <rect x="20" y="10" width="360" height="220" rx="10" className="fill-tema-desde" />
      <g strokeWidth="2.5" className={lineas}>
        <rect x="50" y="40" width="300" height="160" />
        <line x1="50" y1="60" x2="350" y2="60" />
        <line x1="50" y1="180" x2="350" y2="180" />
        <line x1="125" y1="60" x2="125" y2="180" />
        <line x1="275" y1="60" x2="275" y2="180" />
        <line x1="125" y1="120" x2="275" y2="120" />
      </g>
      <line
        x1="200"
        y1="28"
        x2="200"
        y2="212"
        strokeWidth="4"
        strokeDasharray="3 2"
        className="stroke-hero-line"
      />
      <Jugadores
        jugadores={[
          { x: 85, y: 85, equipo: 'rojo' },
          { x: 160, y: 155, equipo: 'rojo' },
          { x: 315, y: 155, equipo: 'azul' },
          { x: 240, y: 85, equipo: 'azul' },
        ]}
      />
      <g className="motion-safe:animate-peloteo">
        <PelotaDeTenis x={200} y={120} r={6} />
      </g>
    </>
  )
}

function CanchaDePadel() {
  return (
    <>
      <rect x="20" y="10" width="360" height="220" rx="10" className="fill-tema-hasta/60" />
      <rect x="40" y="30" width="320" height="180" className="fill-tema-desde" />
      <g strokeWidth="2.5" className={lineas}>
        <line x1="96" y1="30" x2="96" y2="210" />
        <line x1="304" y1="30" x2="304" y2="210" />
        <line x1="96" y1="120" x2="304" y2="120" />
      </g>
      {/* Vidrio en el fondo y al principio de los laterales; malla en el resto */}
      <path
        d="M104 30 H40 V210 H104 M296 30 H360 V210 H296"
        strokeWidth="6"
        className="stroke-hero-glass/80 fill-none"
      />
      <path
        d="M104 30 H296 M104 210 H296"
        strokeWidth="3"
        strokeDasharray="2 3"
        className="stroke-hero-line/50 fill-none"
      />
      <line
        x1="200"
        y1="26"
        x2="200"
        y2="214"
        strokeWidth="4"
        strokeDasharray="3 2"
        className="stroke-hero-line"
      />
      <Jugadores
        jugadores={[
          { x: 140, y: 80, equipo: 'rojo' },
          { x: 140, y: 160, equipo: 'rojo' },
          { x: 260, y: 80, equipo: 'azul' },
          { x: 260, y: 160, equipo: 'azul' },
        ]}
      />
      <g className="motion-safe:animate-peloteo">
        <PelotaDeTenis x={200} y={120} r={6} />
      </g>
    </>
  )
}

function CanchaDeBasquet() {
  const tablas = [40, 62, 84, 106, 128, 150, 172, 194]
  return (
    <>
      <rect x="20" y="10" width="360" height="220" rx="10" className="fill-tema-desde" />
      {/* Tablas del parquet */}
      {tablas.map((y) => (
        <line
          key={y}
          x1="20"
          y1={y}
          x2="380"
          y2={y}
          strokeWidth="1"
          className="stroke-tema-hasta/25"
        />
      ))}
      <rect x="40" y="95" width="62" height="50" className="fill-tema-hasta/30" />
      <rect x="298" y="95" width="62" height="50" className="fill-tema-hasta/30" />
      <g strokeWidth="2.5" className={lineas}>
        <rect x="40" y="30" width="320" height="180" />
        <line x1="200" y1="30" x2="200" y2="210" />
        <circle cx="200" cy="120" r="26" />
        <rect x="40" y="95" width="62" height="50" />
        <rect x="298" y="95" width="62" height="50" />
        <path d="M40 42 H62 A80 80 0 0 1 62 198 H40" />
        <path d="M360 42 H338 A80 80 0 0 0 338 198 H360" />
      </g>
      <circle cx="54" cy="120" r="6" strokeWidth="2.5" className="stroke-hero-orange fill-none" />
      <circle cx="346" cy="120" r="6" strokeWidth="2.5" className="stroke-hero-orange fill-none" />
      <Jugadores
        jugadores={[
          { x: 90, y: 75, equipo: 'rojo' },
          { x: 90, y: 165, equipo: 'rojo' },
          { x: 130, y: 120, equipo: 'rojo' },
          { x: 165, y: 85, equipo: 'rojo' },
          { x: 165, y: 155, equipo: 'rojo' },
          { x: 310, y: 75, equipo: 'azul' },
          { x: 310, y: 165, equipo: 'azul' },
          { x: 270, y: 120, equipo: 'azul' },
          { x: 235, y: 85, equipo: 'azul' },
          { x: 235, y: 155, equipo: 'azul' },
        ]}
      />
      <g className="origin-center [transform-box:fill-box] motion-safe:animate-pique">
        <PelotaDeBasquet x={300} y={120} r={8} />
      </g>
    </>
  )
}

// Inclina la cancha como si se la mirara en diagonal desde arriba, flotando
function CanchaInclinada({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-lg motion-safe:animate-flotar">
      {/* Sombra en el "piso", debajo de la cancha */}
      <div className="absolute inset-x-12 bottom-0 h-10 bg-hero-ink/30 rounded-full blur-2xl" />
      <div style={{ transform: 'perspective(1200px) rotateX(52deg) rotateZ(-28deg)' }}>
        <svg viewBox="0 0 400 240" className="w-full drop-shadow-2xl">
          {children}
        </svg>
      </div>
    </div>
  )
}

function PelotasFlotando({ familias }: { familias: FamiliaDeDeporte[] }) {
  // Un complejo todavía sin canchas muestra las tres pelotas
  const sinCanchas = familias.length === 0
  const tieneFutbol = sinCanchas || familias.includes('futbol')
  const tieneRaqueta = sinCanchas || familias.includes('tenis') || familias.includes('padel')
  const tieneBasquet = sinCanchas || familias.includes('basquet')

  return (
    <svg viewBox="0 0 400 240" className="mx-auto w-full max-w-lg">
      {tieneFutbol && (
        <g className="motion-safe:animate-flotar">
          <PelotaDeFutbol x={130} y={110} r={58} />
        </g>
      )}
      {tieneRaqueta && (
        <g className="motion-safe:animate-flotar" style={{ animationDelay: '-2s' }}>
          <PelotaDeTenis x={265} y={80} r={36} />
        </g>
      )}
      {tieneBasquet && (
        <g className="motion-safe:animate-flotar" style={{ animationDelay: '-4s' }}>
          <PelotaDeBasquet x={285} y={175} r={44} />
        </g>
      )}
    </svg>
  )
}

export function CourtIllustration({
  familia,
  familiasDelComplejo,
}: {
  familia: FamiliaDeDeporte | undefined
  familiasDelComplejo: FamiliaDeDeporte[]
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      {familia === undefined && <PelotasFlotando familias={familiasDelComplejo} />}
      {familia === 'futbol' && (
        <CanchaInclinada>
          <CanchaDeFutbol />
        </CanchaInclinada>
      )}
      {familia === 'tenis' && (
        <CanchaInclinada>
          <CanchaDeTenis />
        </CanchaInclinada>
      )}
      {familia === 'padel' && (
        <CanchaInclinada>
          <CanchaDePadel />
        </CanchaInclinada>
      )}
      {familia === 'basquet' && (
        <CanchaInclinada>
          <CanchaDeBasquet />
        </CanchaInclinada>
      )}
    </div>
  )
}
