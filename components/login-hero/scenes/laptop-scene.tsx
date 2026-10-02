import {
  DESK_SHADOW,
  HAND_NAILS,
  HAND_SHADE,
  HAND_SILHOUETTE,
  HAND_SKIN,
  MOUSE_BODY,
  MOUSE_OUTLINE,
  MOUSE_SHADOW,
  MOUSE_SIDE,
  MOUSE_WHEEL,
  SLEEVE,
  SLEEVE_LIGHT,
  SLEEVE_SHADE,
} from './mouse-hand-paths'
import { CAPTION_RESERVE, SceneCaption } from './scene-caption'
import { DesktopScreens } from './desktop-screens'

// Escena del grupo A: laptop en un escritorio con la web app real. Una mano
// mueve el mouse y el cursor recorre el flujo de reserva: Filtros → Deporte
// (pasa por todas las opciones) → Ver resultados → Reservar → horario.
// La mano con el mouse es la ilustración de referencia vectorizada (ver
// mouse-hand-paths.ts).
// Los elementos animados son siempre un <g> interno: la posición fija va en el
// atributo transform del padre, porque el transform de CSS pisa al del SVG.
export function LaptopScene() {
  return (
    <svg viewBox="0 0 400 340" className="absolute inset-0 size-full">
      <g className="hero-laptop">
        {/* Escritorio */}
        <rect x="0" y="192" width="400" height="108" className="fill-accent" />

        {/* Laptop: marco, pantalla y base */}
        <rect x="56" y="18" width="288" height="170" rx="8" className="fill-muted-foreground" />
        <rect x="63" y="25" width="274" height="156" rx="3" className="fill-card" />
        <path d="M44 188 H356 L346 198 H54 Z" className="fill-muted-foreground/70" />

        {/* La web app, igual que el front real (ver desktop-screens.tsx) */}
        <DesktopScreens />

        {/* Cursor: la punta está en el (0, 0) del dibujo y el CSS lo lleva a
            cada botón con translate (hero-cursor) */}
        <g className="hero-cursor">
          <path
            d="M0 0 v16 l4.5 -4 l3 7 l3 -1.4 l-3 -6.8 h6 Z"
            strokeWidth="1"
            strokeLinejoin="round"
            className="fill-foreground stroke-card"
          />
        </g>

        {/* Mouse: queda en el escritorio hasta que llega la mano y después
            se mueve con ella (.hero-mouse) para llevar el cursor al horario */}
        <g className="hero-mouse">
          <path d={MOUSE_SHADOW} className="fill-foreground/10 dark:fill-background/30" />
          <path d={MOUSE_OUTLINE} className="fill-muted-foreground dark:fill-background/70" />
          <path
            d={MOUSE_BODY}
            fillRule="evenodd"
            className="fill-card dark:fill-muted-foreground"
          />
          <path
            d={MOUSE_SIDE}
            fillRule="evenodd"
            className="fill-muted-foreground/15 dark:fill-background/20"
          />
          <path
            d={MOUSE_WHEEL}
            fillRule="evenodd"
            className="fill-muted-foreground/45 dark:fill-background/35"
          />
        </g>

        {/* Mano: entra sola desde abajo, agarra el mouse y lo acompaña
            (.hero-laptop-hand) */}
        <g className="hero-laptop-hand">
          <path d={DESK_SHADOW} className="fill-foreground/10 dark:fill-background/30" />

          {/* Clic: igual que el pulgar del celular, con el índice (el dedo de
              arriba del pulgar, sobre el botón izquierdo). La mano original
              lleva una máscara que le saca la punta del índice (hasta su
              articulación del medio, x ≈ 309) y encima va una copia recortada
              a esa punta más una franja hacia la mano. En el clic la copia
              gira unos grados sobre la articulación (.hero-index-finger) y la
              punta baja hacia el botón, sin estirarse */}
          <defs>
            <mask
              id="hero-index-base"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="500"
              height="400"
            >
              <rect width="500" height="400" fill="white" />
              <path d="M289.8 227.5 L308.9 229.8 L309.9 242.5 H289.8 Z" fill="black" />
            </mask>
            <clipPath id="hero-index-copy">
              <path d="M289.8 227.5 L311.9 230.2 L312.9 242.5 H289.8 Z" />
            </clipPath>
          </defs>
          <g mask="url(#hero-index-base)">
            <HandLayers />
          </g>
          <path d={SLEEVE} className="fill-primary" />
          <path
            d={SLEEVE_SHADE}
            fillRule="evenodd"
            className="fill-foreground/25 dark:fill-background/35"
          />
          <path
            d={SLEEVE_LIGHT}
            fillRule="evenodd"
            className="fill-background/15 dark:fill-foreground/10"
          />
          <g transform="translate(309.2 235.5)">
            <g className="hero-index-finger">
              <g transform="translate(-309.2 -235.5)" clipPath="url(#hero-index-copy)">
                <HandLayers />
              </g>
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
      <path d={HAND_SHADE} fillRule="evenodd" className="fill-hero-skin-2/40" />
      <path
        d={HAND_NAILS}
        fillRule="evenodd"
        className="fill-background/40 dark:fill-foreground/30"
      />
    </>
  )
}
