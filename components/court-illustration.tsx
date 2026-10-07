import type { Deporte } from '@/lib/generated/prisma/client'
import { PelotaDeBasquet, PelotaDeFutbol, PelotaDeTenis } from '@/components/sport-ball'

// Ilustración del bloque principal del dashboard: la cancha del deporte
// elegido vista desde arriba e inclinada (perspectiva isométrica), con los
// jugadores y la pelota en movimiento. Fútbol 5, 7 y 11 tienen cada uno su
// tamaño, sus marcas y su cantidad de jugadores. Mismo estilo que las escenas
// del login (components/login-hero), dibujada de nuevo acá porque ese módulo
// no se importa desde afuera; las pelotas salen de sport-ball.tsx.
// Es solo decoración (aria-hidden).

const lineas = 'stroke-hero-line/85 fill-none'

type Jugador = { x: number; y: number; equipo: 'rojo' | 'azul' }

function Jugadores({ jugadores, radio }: { jugadores: Jugador[]; radio: number }) {
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
            r={radio}
            className={jugador.equipo === 'rojo' ? 'fill-hero-team-red' : 'fill-hero-team-blue'}
          />
        </g>
      ))}
    </g>
  )
}

type FormatoDeFutbol = 'FUTBOL_5' | 'FUTBOL_7' | 'FUTBOL_11'

type Medida = { fondo: number; alto: number }

type Formato = {
  largo: number
  ancho: number
  // Escala del dibujo: no es la real (la de 11 no entraría al lado de la de 5),
  // pero respeta el orden: la de 5 se ve chica, la de 7 mediana, la de 11 grande
  pxPorMetro: number
  radioJugador: number
  circuloCentral: number
  // Área grande y área chica; en fútbol 5 el área es un semicírculo
  area: Medida | null
  areaChica: Medida | null
  radioDelAreaDeFutbol5: number | null
  arco: number
  puntoPenal: number
  vallas: boolean
  // Posiciones del equipo rojo como fracción de la cancha (0 a 1). El azul es
  // el mismo dibujo dado vuelta.
  equipo: number[][]
}

// Medidas reales en metros de cada formato
const formatosDeFutbol: Record<FormatoDeFutbol, Formato> = {
  FUTBOL_5: {
    largo: 40,
    ancho: 20,
    pxPorMetro: 5.4,
    radioJugador: 7,
    circuloCentral: 3,
    area: null,
    areaChica: null,
    radioDelAreaDeFutbol5: 6,
    arco: 3,
    puntoPenal: 6,
    vallas: true,
    equipo: [
      [0.04, 0.5],
      [0.2, 0.25],
      [0.2, 0.75],
      [0.36, 0.38],
      [0.42, 0.68],
    ],
  },
  FUTBOL_7: {
    largo: 60,
    ancho: 40,
    pxPorMetro: 4.4,
    radioJugador: 6,
    circuloCentral: 6,
    area: { fondo: 12, alto: 26 },
    areaChica: { fondo: 4, alto: 12 },
    radioDelAreaDeFutbol5: null,
    arco: 5,
    puntoPenal: 9,
    vallas: false,
    equipo: [
      [0.03, 0.5],
      [0.16, 0.2],
      [0.16, 0.5],
      [0.16, 0.8],
      [0.3, 0.32],
      [0.3, 0.68],
      [0.43, 0.5],
    ],
  },
  FUTBOL_11: {
    largo: 105,
    ancho: 68,
    pxPorMetro: 3.15,
    radioJugador: 4.5,
    circuloCentral: 9.15,
    area: { fondo: 16.5, alto: 40.3 },
    areaChica: { fondo: 5.5, alto: 18.3 },
    radioDelAreaDeFutbol5: null,
    arco: 7.32,
    puntoPenal: 11,
    vallas: false,
    // 4-4-2
    equipo: [
      [0.03, 0.5],
      [0.14, 0.14],
      [0.14, 0.38],
      [0.14, 0.62],
      [0.14, 0.86],
      [0.28, 0.14],
      [0.28, 0.38],
      [0.28, 0.62],
      [0.28, 0.86],
      [0.42, 0.38],
      [0.44, 0.64],
    ],
  },
}

function CanchaDeFutbol({ formato: nombreDelFormato }: { formato: FormatoDeFutbol }) {
  const formato = formatosDeFutbol[nombreDelFormato]
  const m = (metros: number) => metros * formato.pxPorMetro

  // La cancha centrada en el dibujo de 400 × 240
  const ancho = m(formato.largo)
  const alto = m(formato.ancho)
  const izquierda = 200 - ancho / 2
  const derecha = 200 + ancho / 2
  const arriba = 120 - alto / 2
  const abajo = 120 + alto / 2
  const medio = 120

  // El pasto sigue unos metros más allá de las líneas (en fútbol 5, hasta las vallas)
  const borde = formato.vallas ? m(1.5) : m(4)
  const franjas = [0, 2, 4, 6, 8]

  const jugadores: Jugador[] = []
  for (const [x, y] of formato.equipo) {
    jugadores.push({ x: izquierda + x * ancho, y: arriba + y * alto, equipo: 'rojo' })
  }
  for (const [x, y] of formato.equipo) {
    jugadores.push({ x: izquierda + (1 - x) * ancho, y: arriba + (1 - y) * alto, equipo: 'azul' })
  }

  // Fútbol 11: la medialuna es la parte del círculo de 9,15 m alrededor del
  // punto penal que queda afuera del área (el área termina 5,5 m después del punto)
  const medialuna = m(9.15)
  const mitadDeLaMedialuna = m(Math.sqrt(9.15 * 9.15 - 5.5 * 5.5))
  const corner = m(1)

  return (
    <>
      <rect x="10" y="5" width="380" height="230" rx="14" className="fill-tema-hasta/40" />
      <rect
        x={izquierda - borde}
        y={arriba - borde}
        width={ancho + borde * 2}
        height={alto + borde * 2}
        rx={formato.vallas ? 10 : 4}
        className="fill-tema-desde"
      />
      {/* Franjas del pasto cortado */}
      {franjas.map((franja) => (
        <rect
          key={franja}
          x={izquierda + (franja * ancho) / 10}
          y={arriba}
          width={ancho / 10}
          height={alto}
          className="fill-hero-line/10"
        />
      ))}

      {/* Fútbol 5: cancha cerrada por vallas */}
      {formato.vallas && (
        <rect
          x={izquierda - borde}
          y={arriba - borde}
          width={ancho + borde * 2}
          height={alto + borde * 2}
          rx="10"
          strokeWidth="5"
          className="stroke-hero-line/45 fill-none"
        />
      )}

      <g strokeWidth="2.5" className={lineas}>
        <rect x={izquierda} y={arriba} width={ancho} height={alto} rx="1.5" />
        <line x1="200" y1={arriba} x2="200" y2={abajo} />
        <circle cx="200" cy={medio} r={m(formato.circuloCentral)} />

        {formato.area && (
          <>
            <rect
              x={izquierda}
              y={medio - m(formato.area.alto) / 2}
              width={m(formato.area.fondo)}
              height={m(formato.area.alto)}
            />
            <rect
              x={derecha - m(formato.area.fondo)}
              y={medio - m(formato.area.alto) / 2}
              width={m(formato.area.fondo)}
              height={m(formato.area.alto)}
            />
          </>
        )}
        {formato.areaChica && (
          <>
            <rect
              x={izquierda}
              y={medio - m(formato.areaChica.alto) / 2}
              width={m(formato.areaChica.fondo)}
              height={m(formato.areaChica.alto)}
            />
            <rect
              x={derecha - m(formato.areaChica.fondo)}
              y={medio - m(formato.areaChica.alto) / 2}
              width={m(formato.areaChica.fondo)}
              height={m(formato.areaChica.alto)}
            />
          </>
        )}
        {formato.radioDelAreaDeFutbol5 && (
          <>
            <path
              d={`M${izquierda} ${medio - m(formato.radioDelAreaDeFutbol5)} A${m(formato.radioDelAreaDeFutbol5)} ${m(formato.radioDelAreaDeFutbol5)} 0 0 1 ${izquierda} ${medio + m(formato.radioDelAreaDeFutbol5)}`}
            />
            <path
              d={`M${derecha} ${medio - m(formato.radioDelAreaDeFutbol5)} A${m(formato.radioDelAreaDeFutbol5)} ${m(formato.radioDelAreaDeFutbol5)} 0 0 0 ${derecha} ${medio + m(formato.radioDelAreaDeFutbol5)}`}
            />
          </>
        )}
        {nombreDelFormato === 'FUTBOL_11' && (
          <>
            <path
              d={`M${izquierda + m(16.5)} ${medio - mitadDeLaMedialuna} A${medialuna} ${medialuna} 0 0 1 ${izquierda + m(16.5)} ${medio + mitadDeLaMedialuna}`}
            />
            <path
              d={`M${derecha - m(16.5)} ${medio - mitadDeLaMedialuna} A${medialuna} ${medialuna} 0 0 0 ${derecha - m(16.5)} ${medio + mitadDeLaMedialuna}`}
            />
            {/* Los cuatro córners */}
            <path
              d={`M${izquierda + corner} ${arriba} A${corner} ${corner} 0 0 1 ${izquierda} ${arriba + corner}`}
            />
            <path
              d={`M${derecha - corner} ${arriba} A${corner} ${corner} 0 0 0 ${derecha} ${arriba + corner}`}
            />
            <path
              d={`M${izquierda + corner} ${abajo} A${corner} ${corner} 0 0 0 ${izquierda} ${abajo - corner}`}
            />
            <path
              d={`M${derecha - corner} ${abajo} A${corner} ${corner} 0 0 1 ${derecha} ${abajo - corner}`}
            />
          </>
        )}
      </g>

      {/* Punto central y puntos penales */}
      <circle cx="200" cy={medio} r="2.5" className="fill-hero-line/85" />
      <circle
        cx={izquierda + m(formato.puntoPenal)}
        cy={medio}
        r="2"
        className="fill-hero-line/85"
      />
      <circle cx={derecha - m(formato.puntoPenal)} cy={medio} r="2" className="fill-hero-line/85" />

      {/* Arcos, del ancho real de cada formato */}
      <rect
        x={izquierda - m(2)}
        y={medio - m(formato.arco) / 2}
        width={m(2)}
        height={m(formato.arco)}
        rx="1.5"
        className="fill-hero-line/70"
      />
      <rect
        x={derecha}
        y={medio - m(formato.arco) / 2}
        width={m(2)}
        height={m(formato.arco)}
        rx="1.5"
        className="fill-hero-line/70"
      />

      <Jugadores jugadores={jugadores} radio={formato.radioJugador} />
      <g className="motion-safe:animate-pase">
        <PelotaDeFutbol x={200} y={medio} r={formato.radioJugador * 0.85} />
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
        radio={8}
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
        radio={8}
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
        radio={7}
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

// La cancha del deporte elegido, inclinada y en movimiento
export function CourtIllustration({ deporte }: { deporte: Deporte }) {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <CanchaInclinada>
        {(deporte === 'FUTBOL_5' || deporte === 'FUTBOL_7' || deporte === 'FUTBOL_11') && (
          <CanchaDeFutbol formato={deporte} />
        )}
        {deporte === 'TENIS' && <CanchaDeTenis />}
        {deporte === 'PADEL' && <CanchaDePadel />}
        {deporte === 'BASQUET' && <CanchaDeBasquet />}
      </CanchaInclinada>
    </div>
  )
}
