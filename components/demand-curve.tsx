'use client'

import { useId, useState } from 'react'
import { puntosDeLaCurva, trazoDeLinea } from '@/lib/dashboard'

// Curva de reservas por hora: este período (color del deporte, con relleno)
// contra el anterior (gris). Pasar el mouse mueve una línea vertical y un
// globito con los dos valores de esa hora; con teclado, las flechas.
// El SVG solo dibuja líneas (se estira a lo ancho con preserveAspectRatio
// "none"); los textos y los puntos van en HTML para que no se deformen ni se
// achiquen en pantallas chicas. Todo se ubica en % del área del gráfico.
export function DemandCurve({
  horarios,
  actual,
  anterior,
}: {
  horarios: string[]
  actual: number[]
  anterior: number[]
}) {
  const idDelDegrade = useId()

  let maximo = 0
  let indiceDelPico = 0
  for (let i = 0; i < horarios.length; i++) {
    if (actual[i] > maximo) {
      maximo = actual[i]
      indiceDelPico = i
    }
    if (anterior[i] > maximo) maximo = anterior[i]
  }

  // Sin mouse encima, el globito queda en el pico (como en la referencia)
  const [indiceElegido, setIndiceElegido] = useState<number | null>(null)
  const indice = indiceElegido ?? indiceDelPico

  if (maximo === 0 || horarios.length < 2) {
    return (
      <p className="text-muted-foreground text-base">Todavía no hay reservas en este período.</p>
    )
  }

  // Aire arriba del máximo, para que entre el globito
  const escala = Math.ceil(maximo * 1.4)
  const puntosActuales = puntosDeLaCurva(actual, 100, 100, escala)
  const puntosAnteriores = puntosDeLaCurva(anterior, 100, 100, escala)
  const lineaActual = trazoDeLinea(puntosActuales)
  const ultimo = puntosActuales[puntosActuales.length - 1]
  const relleno = `${lineaActual} L${ultimo.x} 100 L0 100 Z`

  const punto = puntosActuales[indice]
  const puntoAnterior = puntosAnteriores[indice]
  // El globito no se sale por los costados
  const izquierdaDelGlobo = Math.min(Math.max(punto.x, 10), 90)

  function elegirConMouse(evento: React.PointerEvent<HTMLDivElement>) {
    const rectangulo = evento.currentTarget.getBoundingClientRect()
    const fraccion = (evento.clientX - rectangulo.left) / rectangulo.width
    const cercano = Math.round(fraccion * (horarios.length - 1))
    setIndiceElegido(Math.min(Math.max(cercano, 0), horarios.length - 1))
  }

  function elegirConTeclado(evento: React.KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'ArrowRight') {
      setIndiceElegido(Math.min(indice + 1, horarios.length - 1))
    }
    if (evento.key === 'ArrowLeft') {
      setIndiceElegido(Math.max(indice - 1, 0))
    }
  }

  // Con muchas horas se rotula una sí y otra no, para que no se encimen
  const cadaCuanto = horarios.length > 8 ? 2 : 1

  return (
    <div>
      <div className="flex pt-6">
        {/* Eje Y: el techo de la escala, la mitad y 0 */}
        <div className="text-muted-foreground flex h-60 w-10 shrink-0 flex-col justify-between pr-2 text-right text-sm tabular-nums">
          <span className="-translate-y-1/2">{escala}</span>
          <span>{Math.round(escala / 2)}</span>
          <span className="translate-y-1/2">0</span>
        </div>

        <div
          tabIndex={0}
          role="group"
          aria-label="Curva de reservas por hora. Usá las flechas para recorrerla."
          onPointerMove={elegirConMouse}
          onPointerLeave={() => setIndiceElegido(null)}
          onKeyDown={elegirConTeclado}
          onBlur={() => setIndiceElegido(null)}
          className="focus-visible:ring-ring/50 relative h-60 flex-1 cursor-crosshair rounded-md outline-none focus-visible:ring-3"
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 size-full overflow-visible motion-safe:animate-revelar"
          >
            <defs>
              <linearGradient id={idDelDegrade} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--acento)', stopOpacity: 0.35 }} />
                <stop offset="100%" style={{ stopColor: 'var(--acento)', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            {/* Líneas de guía: arriba, al medio y la base */}
            {[0, 50, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                vectorEffect="non-scaling-stroke"
                strokeWidth="1"
                className="stroke-border"
              />
            ))}
            <path d={relleno} fill={`url(#${idDelDegrade})`} />
            <path
              d={trazoDeLinea(puntosAnteriores)}
              vectorEffect="non-scaling-stroke"
              strokeWidth="2"
              strokeLinejoin="round"
              className="stroke-muted-foreground/60 fill-none"
            />
            <path
              d={lineaActual}
              vectorEffect="non-scaling-stroke"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="stroke-acento fill-none"
            />
          </svg>

          {/* Línea vertical que sigue al mouse */}
          <div
            className="bg-foreground/25 pointer-events-none absolute inset-y-0 w-px transition-[left] duration-150"
            style={{ left: `${punto.x}%` }}
          />
          <span
            className="bg-muted-foreground ring-card pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 transition-[left,top] duration-150"
            style={{ left: `${puntoAnterior.x}%`, top: `${puntoAnterior.y}%` }}
          />
          <span
            className="bg-acento ring-card pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-3 transition-[left,top] duration-150"
            style={{ left: `${punto.x}%`, top: `${punto.y}%` }}
          />

          {/* Globito con los valores (como el "359" de la referencia) */}
          <div
            aria-live="polite"
            className="bg-foreground text-background pointer-events-none absolute z-10 rounded-xl px-3 py-2 text-center whitespace-nowrap shadow-lg transition-[left,top] duration-150"
            style={{
              left: `${izquierdaDelGlobo}%`,
              top: `${punto.y}%`,
              transform: 'translate(-50%, calc(-100% - 16px))',
            }}
          >
            <p className="text-sm opacity-75">{horarios[indice]} hs</p>
            <p className="text-lg leading-tight font-semibold">{actual[indice]} reservas</p>
            <p className="text-sm opacity-75">antes: {anterior[indice]}</p>
          </div>
        </div>
      </div>

      {/* Eje X: las horas, ubicadas en el mismo % que sus puntos */}
      <div className="relative mt-2 ml-10 h-6">
        {horarios.map((horario, i) =>
          i % cadaCuanto === 0 ? (
            <span
              key={horario}
              className={
                i === indice
                  ? 'text-foreground absolute -translate-x-1/2 text-sm font-semibold'
                  : 'text-muted-foreground absolute -translate-x-1/2 text-sm'
              }
              style={{ left: `${puntosActuales[i].x}%` }}
            >
              {horario.slice(0, 2)}
            </span>
          ) : null,
        )}
      </div>

      {/* La misma información en tabla, para lectores de pantalla */}
      <table className="sr-only">
        <caption>Reservas por hora</caption>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Este período</th>
            <th>Período anterior</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((horario, i) => (
            <tr key={horario}>
              <td>{horario}</td>
              <td>{actual[i]}</td>
              <td>{anterior[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
