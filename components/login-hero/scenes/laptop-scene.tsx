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
import { SportPicker } from './sports-montage'

// Escena 1 (0–3 s): laptop en un escritorio. Una mano mueve el mouse, el
// cursor hace clic en un horario del calendario y aparece un check.
// La mano con el mouse es la ilustración de referencia vectorizada (ver
// mouse-hand-paths.ts).
// Los elementos animados son siempre un <g> interno: la posición fija va en el
// atributo transform del padre, porque el transform de CSS pisa al del SVG.
export function LaptopScene() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full">
      <g className="hero-laptop">
        {/* Escritorio */}
        <rect x="0" y="192" width="400" height="108" className="fill-accent" />

        {/* Laptop: marco, pantalla y base */}
        <rect x="110" y="64" width="180" height="124" rx="8" className="fill-muted-foreground" />
        <rect x="117" y="71" width="166" height="110" rx="3" className="fill-card" />
        <path d="M96 188 H304 L294 198 H106 Z" className="fill-muted-foreground/70" />

        {/* Calendario verde */}
        <rect x="117" y="71" width="166" height="16" className="fill-primary" />
        <text x="124" y="82" fontSize="7" fontWeight="600" className="fill-primary-foreground">
          Todos los complejos
        </text>
        <SportPicker x={226} y={79} selected={0} ringClass="stroke-primary-foreground" />
        <CalendarRow y={95} />
        <CalendarRow y={124} />
        <CalendarRow y={153} />
        <text
          x="219.5"
          y="167"
          fontSize="8"
          fontWeight="600"
          textAnchor="middle"
          className="fill-primary"
        >
          21:00
        </text>

        {/* Horario elegido: se pinta de verde y aparece el check */}
        <rect
          x="203"
          y="153"
          width="33"
          height="22"
          rx="3"
          className="hero-laptop-slot fill-primary"
        />
        <path
          d="M213 164 l4.5 4.5 l8 -9"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hero-laptop-check stroke-primary-foreground fill-none"
        />

        {/* Cursor: la punta arranca en (160, 105) y viaja hasta el horario */}
        <g className="hero-cursor">
          <path
            d="M160 105 v16 l4.5 -4 l3 7 l3 -1.4 l-3 -6.8 h6 Z"
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
      </g>
    </svg>
  )
}

function CalendarRow({ y }: { y: number }) {
  return (
    <>
      <rect x="125" y={y} width="33" height="22" rx="3" className="fill-primary/15" />
      <rect x="164" y={y} width="33" height="22" rx="3" className="fill-primary/15" />
      <rect x="203" y={y} width="33" height="22" rx="3" className="fill-primary/15" />
      <rect x="242" y={y} width="33" height="22" rx="3" className="fill-primary/15" />
    </>
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
