'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { deporteLabels, formatPrecio } from '@/lib/labels'
import { porcentaje, segmentosDeDona } from '@/lib/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'
import { claseTarjetaDeDatos } from '@/components/data-card'
import { ProgressRing } from '@/components/progress-ring'
import { SportIcon } from '@/components/sport-icon'

// Un color fijo por deporte (tokens de globals.css, validados para que se
// distingan también con daltonismo): su parte de la dona, su barra y su
// anillo usan el mismo. Las clases van escritas enteras para que Tailwind las
// encuentre.
const colorDelDeporte: Record<Deporte, { trazo: string; fondo: string }> = {
  FUTBOL_5: { trazo: 'stroke-deporte-futbol-5', fondo: 'bg-deporte-futbol-5' },
  FUTBOL_7: { trazo: 'stroke-deporte-futbol-7', fondo: 'bg-deporte-futbol-7' },
  FUTBOL_11: { trazo: 'stroke-deporte-futbol-11', fondo: 'bg-deporte-futbol-11' },
  TENIS: { trazo: 'stroke-deporte-tenis', fondo: 'bg-deporte-tenis' },
  PADEL: { trazo: 'stroke-deporte-padel', fondo: 'bg-deporte-padel' },
  BASQUET: { trazo: 'stroke-deporte-basquet', fondo: 'bg-deporte-basquet' },
}

const RADIO = 52
const LARGO_DEL_CIRCULO = 2 * Math.PI * RADIO
const GROSOR = 11
// Las puntas redondeadas agregan medio grosor de cada lado: se descuenta para
// que entre parte y parte quede un espacio de 4
const SEPARACION = GROSOR + 4

export type FilaDeDeporte = {
  deporte: Deporte
  porcentaje: number
  turnosReservados: number
  ingresos: number
  href: string
}

// Cómo se reparten los ingresos entre los deportes (dona y barras) y cuánto se
// ocupa cada uno (anillos). Pasar el mouse por un deporte lo resalta en la
// dona y en la lista; tocarlo filtra el dashboard por ese deporte.
export function SportBreakdown({ filas }: { filas: FilaDeDeporte[] }) {
  const [deporteActivo, setDeporteActivo] = useState<Deporte | null>(null)

  let ingresosTotales = 0
  const ingresos: number[] = []
  for (const fila of filas) {
    ingresosTotales += fila.ingresos
    ingresos.push(fila.ingresos)
  }
  const segmentos = segmentosDeDona(ingresos, LARGO_DEL_CIRCULO, SEPARACION)

  let filaActiva: FilaDeDeporte | null = null
  for (const fila of filas) {
    if (fila.deporte === deporteActivo) filaActiva = fila
  }

  return (
    <section className={`${claseTarjetaDeDatos} p-4 sm:p-5`}>
      <h2 className="mb-4 text-xl font-semibold">Por deporte</h2>

      <div className="grid grid-cols-1 items-center gap-4 sm:gap-8 md:grid-cols-[auto_minmax(0,1fr)]">
        <div className="relative mx-auto size-40 sm:size-52">
          <svg
            viewBox="0 0 120 120"
            aria-hidden="true"
            className="size-full -rotate-90 drop-shadow-md"
          >
            {/* Disco suave del fondo y el riel por donde van las partes */}
            <circle cx="60" cy="60" r="44" className="fill-acento/5" />
            <circle
              cx="60"
              cy="60"
              r={RADIO}
              fill="none"
              strokeWidth={GROSOR}
              className="stroke-muted"
            />
            {filas.map((fila, i) =>
              // Una parte demasiado chica no se dibuja: con la punta redonda
              // quedaría un punto suelto
              segmentos[i].largo > 0 ? (
                <circle
                  key={fila.deporte}
                  cx="60"
                  cy="60"
                  r={RADIO}
                  fill="none"
                  strokeWidth={fila.deporte === deporteActivo ? GROSOR + 4 : GROSOR}
                  strokeLinecap="round"
                  strokeDasharray={`${segmentos[i].largo} ${LARGO_DEL_CIRCULO}`}
                  // La punta redonda empieza medio grosor antes: se corre esa mitad
                  strokeDashoffset={-(segmentos[i].inicio + GROSOR / 2)}
                  onMouseEnter={() => setDeporteActivo(fila.deporte)}
                  onMouseLeave={() => setDeporteActivo(null)}
                  className={`${colorDelDeporte[fila.deporte].trazo} cursor-pointer transition-[stroke-width,opacity] duration-300 motion-safe:animate-dibujar-segmento ${deporteActivo !== null && fila.deporte !== deporteActivo ? 'opacity-25' : ''}`}
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ) : null,
            )}
          </svg>

          {/* Al medio: el total, o el deporte que está bajo el mouse */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
            {filaActiva ? (
              <>
                <SportIcon deporte={filaActiva.deporte} className="mb-1 size-8" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {deporteLabels[filaActiva.deporte]}
                </span>
                <span className="text-xl font-semibold whitespace-nowrap">
                  {formatPrecio(filaActiva.ingresos)}
                </span>
                <span className="text-muted-foreground text-sm whitespace-nowrap">
                  {porcentaje(filaActiva.ingresos, ingresosTotales)}% del total
                </span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground text-sm">Ingresos</span>
                <span className="text-xl font-semibold whitespace-nowrap">
                  {formatPrecio(ingresosTotales)}
                </span>
                <span className="text-muted-foreground text-sm">{filas.length} deportes</span>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="text-muted-foreground mb-2 flex justify-between px-3 text-sm font-medium">
            <span>Ingresos</span>
            <span className="sm:pr-8">Ocupación</span>
          </div>
          <ul className="space-y-1">
            {filas.map((fila) => {
              const parte = porcentaje(fila.ingresos, ingresosTotales)
              const activa = fila.deporte === deporteActivo

              return (
                <li key={fila.deporte}>
                  <Link
                    href={fila.href}
                    scroll={false}
                    onMouseEnter={() => setDeporteActivo(fila.deporte)}
                    onMouseLeave={() => setDeporteActivo(null)}
                    onFocus={() => setDeporteActivo(fila.deporte)}
                    onBlur={() => setDeporteActivo(null)}
                    className={
                      activa
                        ? 'bg-muted group flex items-center gap-3 rounded-xl p-2 transition-all active:scale-[0.98] sm:gap-4 sm:p-3'
                        : 'group flex items-center gap-3 rounded-xl p-2 transition-all active:scale-[0.98] sm:gap-4 sm:p-3'
                    }
                  >
                    <span className="bg-background flex size-9 shrink-0 items-center justify-center rounded-xl shadow-sm sm:size-10">
                      <SportIcon deporte={fila.deporte} className="size-7" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p className="text-lg font-semibold whitespace-nowrap">
                          {deporteLabels[fila.deporte]}
                        </p>
                        <p className="text-muted-foreground text-sm whitespace-nowrap">
                          {formatPrecio(fila.ingresos)} · {parte}%
                        </p>
                      </div>
                      {/* Su parte de los ingresos, del mismo color que en la dona */}
                      <div className="bg-muted mt-1.5 h-1.5 rounded-full">
                        <div
                          className={`h-full origin-left rounded-full transition-[width] duration-700 motion-safe:animate-crecer-barra ${colorDelDeporte[fila.deporte].fondo}`}
                          style={{ width: `${parte}%` }}
                        />
                      </div>
                    </div>

                    <ProgressRing
                      porcentaje={fila.porcentaje}
                      className="size-11 sm:size-12"
                      claseFondo="stroke-muted"
                      claseRelleno={colorDelDeporte[fila.deporte].trazo}
                    >
                      <span className="text-sm font-semibold">{fila.porcentaje}%</span>
                    </ProgressRing>
                    <ChevronRight className="text-muted-foreground hidden size-5 shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
