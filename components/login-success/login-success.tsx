'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './login-success.css'

// Pantalla de carga que se muestra después de un login correcto: tapa toda la
// pantalla, reproduce la animación del logo una vez y recién ahí redirige al
// inicio del rol.
// FUERA DEL ALCANCE DEL PARCIAL (igual que components/login-hero/): es
// decorativa. El logo está vectorizado en tres trazos para poder animarlos por
// separado — la pelota (PELOTA), el gancho (GANCHO) y la cinta (CINTA) —; los
// tres juntos y quietos son el logo exacto. El movimiento vive en
// login-success.css.

const PELOTA =
  'M207.5 472.4C154.0 465.2 110.0 442.3 73.0 402.5C46.5 374.1 26.4 334.4 19.0 296.2C4.0 218.6 34.4 134.7 95.5 85.1C130.4 56.7 170.3 40.7 215.0 36.9C254.0 33.6 297.3 42.3 330.6 60.1C345.3 67.9 368.1 83.1 368.0 84.8C367.9 85.2 363.1 90.6 357.2 96.8L346.5 108.1L339.5 102.9C331.4 97.0 319.1 89.7 310.3 85.6L304.1 82.7L295.8 86.0C286.8 89.5 256.2 104.6 249.9 108.6L246.0 111.0L246.0 140.8L246.0 170.5L255.8 177.0C268.1 185.2 292.5 202.7 293.8 204.3C294.5 205.1 293.9 208.7 291.8 215.9C290.2 221.7 285.5 240.3 281.4 257.4C272.8 293.5 271.0 299.5 266.3 307.2C257.9 321.3 239.3 330.5 223.5 328.5C206.3 326.3 193.5 316.1 186.6 298.9C183.9 292.4 180.0 274.3 180.0 268.4L180.0 265.0L169.5 265.0L159.1 265.0L158.1 261.2C157.6 259.2 156.0 252.8 154.6 247.1C153.2 241.5 151.6 236.2 151.1 235.6C149.9 234.2 145.2 232.3 118.1 222.6C91.1 212.9 94.9 212.4 77.9 227.8C70.0 234.9 62.2 242.3 60.7 244.1C59.1 246.0 55.8 249.6 53.2 252.2L48.6 257.0L48.9 265.2C49.2 276.4 51.4 291.6 54.4 302.5C58.2 316.6 63.0 328.9 65.0 330.0C67.4 331.3 97.3 342.1 107.0 345.1C114.3 347.5 114.5 347.6 119.6 355.0C132.0 372.8 136.0 377.8 144.0 385.9C148.7 390.6 155.7 396.7 159.7 399.4L166.9 404.3L171.1 415.9C173.4 422.3 175.7 428.5 176.1 429.7C177.0 432.1 183.3 434.3 200.5 438.2C209.1 440.1 213.5 440.4 232.0 440.4C254.5 440.5 262.9 439.4 280.5 433.9C286.4 432.1 286.5 432.0 288.4 426.8C295.2 407.2 295.5 406.7 302.6 402.0C317.2 392.4 330.7 377.5 342.5 358.2L349.5 346.8L364.5 342.1C385.6 335.5 398.9 330.2 400.5 327.6C403.6 322.9 410.0 302.3 412.4 289.4C415.4 273.5 416.2 260.4 414.6 257.1C413.7 255.5 405.8 246.9 397.0 238.1L381.0 221.9L382.5 215.9C386.9 198.9 398.2 171.6 407.4 155.3C413.7 144.2 415.3 142.0 416.8 142.0C418.2 142.0 427.8 161.1 433.4 175.3C439.2 189.7 444.3 209.4 446.6 225.5C448.9 241.6 448.9 268.6 446.7 284.8C435.7 362.9 378.6 433.5 303.7 461.4C275.0 472.1 237.3 476.4 207.5 472.4ZM176.1 199.6C182.9 194.5 194.6 186.0 202.0 180.8C209.4 175.7 216.0 170.3 216.7 169.0C218.1 166.3 218.4 125.4 217.2 115.1L216.5 109.8L204.0 103.1C191.0 96.2 171.7 87.2 164.0 84.5L159.5 82.9L148.5 88.4C134.3 95.4 117.8 107.1 106.8 118.0L98.0 126.6L98.0 135.6C98.0 145.5 100.3 172.3 102.0 181.0C103.2 187.3 104.3 188.4 112.5 190.9C119.7 193.2 153.1 205.2 158.0 207.4C159.9 208.2 162.0 208.9 162.6 209.0C163.2 209.0 169.2 204.8 176.1 199.6Z'

const GANCHO =
  'M192.0 373.4C172.5 369.9 163.9 366.6 152.5 358.6C139.6 349.3 130.4 337.0 124.4 320.8C120.8 311.4 116.5 290.1 117.8 288.8C118.2 288.4 128.3 287.7 140.2 287.4L161.9 286.7L162.6 289.6C164.6 298.3 168.1 309.2 170.3 313.6C176.5 325.7 187.1 336.5 199.0 342.5C216.5 351.3 238.2 351.6 252.7 343.0C256.9 340.5 256.9 341.2 252.3 347.1C244.4 357.4 228.9 367.6 215.8 370.9C207.9 372.9 196.3 374.1 192.0 373.4Z'

const CINTA =
  'M212.0 402.9C202.0 401.4 191.1 398.1 182.3 394.0C177.6 391.8 173.9 389.7 174.2 389.5C174.5 389.2 178.1 389.5 182.1 390.1C192.4 391.7 211.6 390.7 221.0 388.0C235.6 383.9 250.8 374.4 262.1 362.2C279.5 343.6 288.3 322.1 299.5 271.0C310.0 222.5 319.4 193.6 333.2 167.0C346.9 140.7 360.0 123.0 381.1 102.5C402.6 81.6 422.2 68.6 450.5 56.5C461.4 51.8 487.3 45.0 494.1 45.0C495.6 45.0 492.0 47.5 484.5 51.7C443.5 74.4 413.8 103.7 389.2 145.5C374.5 170.5 360.8 211.3 352.0 256.5C346.3 285.9 342.8 301.4 339.5 313.0C327.7 353.5 307.6 378.6 274.7 394.0C256.7 402.4 232.0 406.0 212.0 402.9Z'

// Eje central de la cinta: por acá barre la máscara que la "dibuja", y 521 es
// el largo de ese eje en unidades del viewBox (va también en el
// stroke-dashoffset inicial de .success-draw).
const EJE_DE_LA_CINTA =
  'M174 389L196 394L218 395L240 392L262 382L284 364L300 342L310 320L317 298L323 275L328 253L333 231L339 209L348 186L358 164L370 142L386 120L406 97L428 78L450 64L472 53L495 45'
const LARGO_DEL_EJE = 521

// Solo se muestra un overlay a la vez, así que la máscara puede tener un id fijo.
const ID_DE_LA_MASCARA = 'success-mask'

// Lo que tarda la animación completa, y lo que tarda el overlay en desaparecer
// (tiene que coincidir con la transition de .success-overlay en el CSS).
const ESPERA_MS = 2300
const SALIDA_MS = 280
// A quien pidió menos movimiento no se le hace esperar la animación.
const ESPERA_SIN_MOVIMIENTO_MS = 900

export function LoginSuccess({ nombre, destino }: { nombre?: string | null; destino: string }) {
  const router = useRouter()
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    // Se pide la próxima página mientras corre la animación, así el redirect
    // no suma espera encima.
    router.prefetch(destino)

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const espera = sinMovimiento ? ESPERA_SIN_MOVIMIENTO_MS : ESPERA_MS

    const aSalir = setTimeout(() => setSaliendo(true), espera)
    const aRedirigir = setTimeout(() => {
      router.push(destino)
      router.refresh()
    }, espera + SALIDA_MS)

    return () => {
      clearTimeout(aSalir)
      clearTimeout(aRedirigir)
    }
  }, [destino, router])

  const primerNombre = nombre ? nombre.split(' ')[0] : ''

  return (
    <div
      role="status"
      aria-live="polite"
      className={`success-overlay bg-background fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${
        saliendo ? 'success-saliendo' : ''
      }`}
    >
      {/* Líneas de una cancha, apenas visibles, de fondo (como en el panel del login) */}
      <svg
        aria-hidden
        viewBox="0 0 1280 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-primary absolute inset-0 size-full opacity-8"
      >
        <rect x="80" y="56" width="1120" height="688" rx="6" />
        <line x1="640" y1="56" x2="640" y2="744" />
        <circle cx="640" cy="324" r="168" />
        <rect x="80" y="214" width="150" height="372" />
        <rect x="1050" y="214" width="150" height="372" />
      </svg>

      <div className="relative flex flex-col items-center px-6 text-center">
        {/* El logo mide 9.5rem, pero se achica si la pantalla es angosta (30vw)
            o baja (22dvh), que es el caso del celular acostado. */}
        <svg
          viewBox="0 0 512 512"
          role="img"
          aria-label="TocaYJuga"
          className="fill-primary w-[min(9.5rem,30vw,22dvh)] overflow-visible"
        >
          <defs>
            <mask id={ID_DE_LA_MASCARA}>
              <path
                className="success-draw"
                d={EJE_DE_LA_CINTA}
                fill="none"
                stroke="#fff"
                strokeWidth="64"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${LARGO_DEL_EJE} ${LARGO_DEL_EJE * 2}`}
              />
            </mask>
          </defs>

          <circle
            className="success-ring stroke-primary"
            cx="231.3"
            cy="254.6"
            r="238"
            fill="none"
            strokeWidth="7"
          />

          <g className="success-spin">
            <path d={PELOTA} />
            <g className="success-rib">
              <path className="success-hook" d={GANCHO} />
              <g mask={`url(#${ID_DE_LA_MASCARA})`}>
                <path d={CINTA} />
              </g>
            </g>
          </g>
        </svg>

        <p className="success-word font-brand mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Toca<span className="text-primary">Y</span>Juga
        </p>
        <p className="success-msg font-heading mt-3 text-lg font-bold sm:text-xl">
          {primerNombre ? `¡Hola de nuevo, ${primerNombre}!` : '¡Hola de nuevo!'}
        </p>
        <p className="success-sub text-muted-foreground mt-2 text-sm sm:text-base">
          Entrando a tu cuenta…
        </p>

        <div className="bg-border mt-5 h-1 w-42 overflow-hidden rounded-full sm:w-50">
          <div className="success-bar bg-primary h-full w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}
