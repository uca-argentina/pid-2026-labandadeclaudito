import { HAND_NAILS, HAND_SILHOUETTE, HAND_SKIN, SLEEVE } from './phone-hand-paths'
import { MobileScreens } from './mobile-screens'
import { CAPTION_RESERVE, SceneCaption } from './scene-caption'

// Escena del grupo B: celular con la web app en mobile. La mano derecha lo
// sostiene y el pulgar toca siempre el mismo punto (onda circular): el select
// de Deporte, la opción Pádel, el horario y "Reservar".
// La mano es la ilustración de referencia vectorizada (ver phone-hand-paths.ts).
// Igual que en la laptop, la posición fija va en el transform del SVG y la
// animación en un <g> interno (el transform de CSS pisa al del SVG).
export function PhoneScene() {
  return (
    <svg viewBox="0 0 400 340" className="absolute inset-0 size-full">
      <g className="hero-phone">
        <clipPath id="hero-phone-clip">
          <rect x="0" y="0" width="400" height="300" />
        </clipPath>
        {/* El brazo sube desde el borde de abajo del escenario: el recorte lo
            frena ahí para que no pise la leyenda de abajo */}
        <g clipPath="url(#hero-phone-clip)">
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

              {/* La web app en mobile, igual que el front real (ver mobile-screens.tsx) */}
              <MobileScreens />

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
        <SceneCaption text={CAPTION_RESERVE} />
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
