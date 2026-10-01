import { HAND_NAILS, HAND_SILHOUETTE, HAND_SKIN, SLEEVE } from './phone-hand-paths'
import { SportPicker } from './sports-montage'

// Escena 2 (3–6 s): celular. La mano derecha lo sostiene y el pulgar toca el
// horario de pádel de las 19:30: onda circular, check y sube el chip.
// La mano es la ilustración de referencia vectorizada (ver phone-hand-paths.ts).
// Igual que en la laptop, la posición fija va en el transform del SVG y la
// animación en un <g> interno (el transform de CSS pisa al del SVG).
const SLOT_ROWS = [
  { y: 112, times: ['17:00', '17:30'] },
  { y: 138, times: ['18:00', '18:30'] },
  { y: 164, times: ['19:00', '19:30'] },
  { y: 190, times: ['20:00', '20:30'] },
]
// Grilla ubicada para que el centro del 19:30 (222, 174) quede justo donde
// apoya la yema del pulgar cuando aprieta
const SLOT_COLUMNS = [163, 205]

export function PhoneScene() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
      <g className="hero-phone">
        <g className="hero-phone-hand">
          {/* Achicado al 85 % desde el borde de arriba del celular para que
              la mano entre completa hasta la manga en el escenario */}
          <g transform="translate(200 56) scale(0.85) translate(-200 -56)">
            {/* Celular: marco, pantalla y cámara */}
            <rect
              x="150"
              y="56"
              width="100"
              height="212"
              rx="14"
              className="fill-muted-foreground"
            />
            <rect x="156" y="62" width="88" height="200" rx="9" className="fill-card" />
            <rect
              x="186"
              y="66"
              width="28"
              height="5"
              rx="2.5"
              className="fill-muted-foreground/40"
            />

            {/* App: barra verde y grilla de horarios */}
            <rect x="156" y="76" width="88" height="20" className="fill-primary" />
            <text
              x="200"
              y="89.5"
              fontSize="9"
              fontWeight="600"
              textAnchor="middle"
              className="fill-primary-foreground"
            >
              Pádel · hoy
            </text>
            <SportPicker x={172} y={104} selected={1} ringClass="stroke-primary" />
            {SLOT_ROWS.map((row) =>
              SLOT_COLUMNS.map((x, i) => (
                <g key={row.times[i]}>
                  <rect x={x} y={row.y} width="34" height="20" rx="3" className="fill-primary/15" />
                  <text
                    x={x + 17}
                    y={row.y + 13}
                    fontSize="7"
                    fontWeight="600"
                    textAnchor="middle"
                    className="fill-primary"
                  >
                    {row.times[i]}
                  </text>
                </g>
              )),
            )}
            <rect x="166" y="220" width="68" height="20" rx="10" className="fill-primary/25" />

            {/* Horario elegido (19:30): se pinta de verde y aparece el check */}
            <rect
              x="205"
              y="164"
              width="34"
              height="20"
              rx="3"
              className="hero-phone-slot fill-primary"
            />
            <path
              d="M215.5 174 l4.5 4.5 l8 -9"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hero-phone-check stroke-primary-foreground fill-none"
            />

            {/* Mano: va toda encima del celular porque los trazos son solo lo
              que se ve (dedos sobre el borde izquierdo, pulgar sobre la
              pantalla, talón debajo).
              Touch: el pulgar se separa en el nudillo, sobre la línea que va
              de la muesca del contorno izquierdo al último pliegue de la
              derecha. La mano original lleva una máscara que le saca la punta
              del pulgar por encima de esa línea, y encima va una copia
              recortada a la punta más una franja de 4 px por debajo. Al
              apretar, la copia gira sobre el centro del nudillo
              (.hero-thumb) como una articulación: la franja tapa el hueco que
              abre el giro y el pliegue disimula la unión */}
            <defs>
              <mask
                id="hero-thumb-base"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="400"
                height="400"
              >
                <rect width="400" height="400" fill="white" />
                <path d="M209.8 158.9 H285.3 V177 L209.8 224.7 Z" fill="black" />
              </mask>
              <clipPath id="hero-thumb-copy">
                <path d="M209.8 158.9 H291 V177.4 L209.8 228.7 Z" />
              </clipPath>
            </defs>
            <g mask="url(#hero-thumb-base)">
              <HandLayers />
            </g>
            <path d={SLEEVE} className="fill-primary" />
            <g className="hero-thumb">
              <g clipPath="url(#hero-thumb-copy)">
                <HandLayers />
              </g>
            </g>

            {/* Onda del toque, centrada donde apoya la yema con el pulgar
              girado. Va encima del pulgar para que se vea alrededor */}
            <circle
              cx="222"
              cy="174"
              r="14"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className="hero-ripple stroke-primary fill-none"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

function HandLayers() {
  return (
    <>
      <path d={HAND_SILHOUETTE} fillRule="evenodd" className="fill-hero-skin-2" />
      <path d={HAND_SKIN} fillRule="evenodd" className="fill-hero-skin-1" />
      <path
        d={HAND_NAILS}
        fillRule="evenodd"
        className="fill-background/40 dark:fill-foreground/30"
      />
    </>
  )
}
