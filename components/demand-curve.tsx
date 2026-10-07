'use client'

import { useId, useState } from 'react'
import { puntosDeLaCurva, trazoSuave, variacionPorcentual } from '@/lib/dashboard'
import { VariationBadge } from '@/components/variation-badge'

type Franja = { etiqueta: string; desde: number; hasta: number; reservas: number }

// Mañana (antes de las 12), tarde (12 a 18) y noche, como rangos de índices
// de la lista de horarios (que viene ordenada). Las vacías no se devuelven.
function franjasDeLosHorarios(horarios: string[], reservas: number[]): Franja[] {
  const franjas: Franja[] = [
    { etiqueta: 'Mañana', desde: -1, hasta: -1, reservas: 0 },
    { etiqueta: 'Tarde', desde: -1, hasta: -1, reservas: 0 },
    { etiqueta: 'Noche', desde: -1, hasta: -1, reservas: 0 },
  ]
  for (let i = 0; i < horarios.length; i++) {
    let franja = franjas[2]
    if (horarios[i] < '12:00') franja = franjas[0]
    else if (horarios[i] < '18:00') franja = franjas[1]

    if (franja.desde === -1) franja.desde = i
    franja.hasta = i
    franja.reservas += reservas[i]
  }

  const conHorarios: Franja[] = []
  for (const franja of franjas) {
    if (franja.desde !== -1) conHorarios.push(franja)
  }
  return conHorarios
}

// Curva de reservas por hora: este período (color del deporte, con relleno y
// brillo) contra el anterior (gris). De fondo, las franjas del día con su
// total. Pasar el mouse resalta la hora y muestra un globito con los dos
// valores y cuánto cambió; con teclado, las flechas.
// El SVG solo dibuja las líneas (se estira a lo ancho con preserveAspectRatio
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

  // Sin mouse encima, el globito queda en el pico
  const [indiceElegido, setIndiceElegido] = useState<number | null>(null)
  const indice = indiceElegido ?? indiceDelPico

  if (maximo === 0 || horarios.length < 2) {
    return (
      <p className="text-muted-foreground text-base">Todavía no hay reservas en este período.</p>
    )
  }

  // Aire arriba del máximo para el globito, redondeado a un número limpio
  const escala = Math.ceil((maximo * 1.4) / 10) * 10
  const puntosActuales = puntosDeLaCurva(actual, 100, 100, escala)
  const puntosAnteriores = puntosDeLaCurva(anterior, 100, 100, escala)
  const lineaActual = trazoSuave(puntosActuales, 100)
  const ultimo = puntosActuales[puntosActuales.length - 1]
  const relleno = `${lineaActual} L${ultimo.x} 100 L0 100 Z`

  const punto = puntosActuales[indice]
  const puntoAnterior = puntosAnteriores[indice]
  // El globito no se sale por los costados
  const izquierdaDelGlobo = Math.min(Math.max(punto.x, 12), 88)
  // Ancho de una hora en %, para la columna resaltada y las franjas
  const anchoDeUnaHora = 100 / (horarios.length - 1)

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

  // Dónde empieza y cuánto mide cada franja, en % del ancho del gráfico
  const bandas: { etiqueta: string; reservas: number; izquierda: number; ancho: number }[] = []
  for (const franja of franjasDeLosHorarios(horarios, actual)) {
    const izquierda = Math.max((franja.desde - 0.5) * anchoDeUnaHora, 0)
    const derecha = Math.min((franja.hasta + 0.5) * anchoDeUnaHora, 100)
    bandas.push({
      etiqueta: franja.etiqueta,
      reservas: franja.reservas,
      izquierda,
      ancho: derecha - izquierda,
    })
  }

  // En pantallas chicas se ve un rótulo de cada dos de los que se muestran
  // (cada 4 horas), para que no se encimen
  function soloEnPantallasGrandes(i: number) {
    return (i / cadaCuanto) % 2 === 1 ? 'hidden sm:block' : ''
  }

  // El primer rótulo de horas arranca en el borde y el último termina en el
  // borde, para que no se salgan del gráfico
  function claseDelRotulo(i: number) {
    if (i === 0) return 'translate-x-0'
    if (i === horarios.length - 1) return '-translate-x-full'
    return '-translate-x-1/2'
  }

  return (
    <div>
      {/* Las franjas del día con su total, arriba del gráfico. En pantallas
          chicas no entran sin encimarse: ahí se ven solo las bandas */}
      <div className="relative mb-1 ml-10 hidden h-6 sm:block">
        {bandas.map((banda) => (
          <p
            key={banda.etiqueta}
            className="text-muted-foreground absolute px-2 text-sm font-medium whitespace-nowrap"
            style={{ left: `${banda.izquierda}%` }}
          >
            {banda.etiqueta} <span className="text-foreground font-semibold">{banda.reservas}</span>
          </p>
        ))}
      </div>

      <div className="flex">
        {/* Eje Y: el techo de la escala, la mitad y 0 */}
        <div className="text-muted-foreground flex h-72 w-10 shrink-0 flex-col justify-between pr-2 text-right text-sm tabular-nums">
          <span className="-translate-y-1/2">{escala}</span>
          <span>{escala / 2}</span>
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
          className="focus-visible:ring-ring/50 relative h-72 flex-1 cursor-crosshair rounded-md outline-none focus-visible:ring-3"
        >
          {/* Franjas del día de fondo (una sí y otra no, con un tinte) */}
          {bandas.map((banda, i) => (
            <div
              key={banda.etiqueta}
              className={
                i % 2 === 0
                  ? 'bg-acento/4 border-border/60 pointer-events-none absolute inset-y-0 border-r'
                  : 'border-border/60 pointer-events-none absolute inset-y-0 border-r'
              }
              style={{ left: `${banda.izquierda}%`, width: `${banda.ancho}%` }}
            />
          ))}

          {/* Columna de la hora elegida */}
          <div
            className="bg-acento/10 pointer-events-none absolute inset-y-0 rounded-md transition-[left] duration-150"
            style={{
              left: `${Math.max(punto.x - anchoDeUnaHora / 2, 0)}%`,
              width: `${anchoDeUnaHora}%`,
            }}
          />

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 size-full overflow-visible motion-safe:animate-revelar"
          >
            <defs>
              <linearGradient id={idDelDegrade} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--acento)', stopOpacity: 0.4 }} />
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
              d={trazoSuave(puntosAnteriores, 100)}
              vectorEffect="non-scaling-stroke"
              strokeWidth="2"
              className="stroke-muted-foreground/50 fill-none"
            />
            <path
              d={lineaActual}
              vectorEffect="non-scaling-stroke"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="stroke-acento fill-none"
              // Brillo suave del color del deporte debajo de la línea
              style={{
                filter:
                  'drop-shadow(0 6px 8px color-mix(in oklab, var(--acento) 45%, transparent))',
              }}
            />
          </svg>

          <span
            className="bg-muted-foreground ring-card pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 transition-[left,top] duration-150"
            style={{ left: `${puntoAnterior.x}%`, top: `${puntoAnterior.y}%` }}
          />
          {/* Punto de la hora elegida, con un halo que late */}
          <span
            className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-150"
            style={{ left: `${punto.x}%`, top: `${punto.y}%` }}
          >
            <span className="bg-acento/50 absolute inset-0 rounded-full motion-safe:animate-ping" />
            <span className="bg-acento ring-card absolute inset-0 rounded-full ring-3" />
          </span>

          {/* Globito con los valores (como el "359" de la referencia) */}
          <div
            aria-live="polite"
            className="bg-card text-card-foreground border-acento/20 pointer-events-none absolute z-10 rounded-xl border px-4 py-2.5 whitespace-nowrap shadow-xl transition-[left,top] duration-150"
            style={{
              left: `${izquierdaDelGlobo}%`,
              top: `${punto.y}%`,
              // Arriba del punto; si el punto está muy alto, abajo (si no, se
              // sale del gráfico y tapa las franjas)
              transform:
                punto.y < 45 ? 'translate(-50%, 18px)' : 'translate(-50%, calc(-100% - 18px))',
            }}
          >
            <p className="text-muted-foreground text-sm">{horarios[indice]} hs</p>
            <p className="text-xl leading-tight font-semibold">{actual[indice]} reservas</p>
            <div className="mt-1 flex items-center gap-2">
              <VariationBadge
                variacion={variacionPorcentual(actual[indice], anterior[indice])}
                subirEsBueno={true}
              />
              <span className="text-muted-foreground text-sm">antes {anterior[indice]}</span>
            </div>
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
                  ? `text-acento absolute text-sm font-semibold whitespace-nowrap ${claseDelRotulo(i)} ${soloEnPantallasGrandes(i)}`
                  : `text-muted-foreground absolute text-sm whitespace-nowrap ${claseDelRotulo(i)} ${soloEnPantallasGrandes(i)}`
              }
              style={{ left: `${puntosActuales[i].x}%` }}
            >
              {horario.slice(0, 2)} h
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
