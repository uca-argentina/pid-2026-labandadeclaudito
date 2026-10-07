'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { deporteLabels, formatPrecio } from '@/lib/labels'
import { porcentaje, segmentosDeDona } from '@/lib/dashboard'
import type { Deporte } from '@/lib/generated/prisma/client'
import { ProgressRing } from '@/components/progress-ring'
import { SportIcon } from '@/components/sport-icon'

// Un color fijo por deporte (tokens de globals.css): la parte de la dona y el
// anillo de ocupación del mismo deporte usan el mismo. Las clases van
// escritas enteras para que Tailwind las encuentre.
const trazoDelDeporte: Record<Deporte, string> = {
  FUTBOL_5: 'stroke-deporte-futbol-5',
  FUTBOL_7: 'stroke-deporte-futbol-7',
  FUTBOL_11: 'stroke-deporte-futbol-11',
  TENIS: 'stroke-deporte-tenis',
  PADEL: 'stroke-deporte-padel',
  BASQUET: 'stroke-deporte-basquet',
}

const RADIO = 52
const LARGO_DEL_CIRCULO = 2 * Math.PI * RADIO

export type FilaDeDeporte = {
  deporte: Deporte
  porcentaje: number
  turnosReservados: number
  ingresos: number
  href: string
}

// Cómo se reparten los ingresos entre los deportes del complejo (dona) y la
// ocupación de cada uno (lista). Pasar el mouse por un deporte lo resalta en
// los dos lados; tocarlo filtra el dashboard por ese deporte.
export function SportBreakdown({ filas }: { filas: FilaDeDeporte[] }) {
  const [deporteActivo, setDeporteActivo] = useState<Deporte | null>(null)

  let ingresosTotales = 0
  const ingresos: number[] = []
  for (const fila of filas) {
    ingresosTotales += fila.ingresos
    ingresos.push(fila.ingresos)
  }
  const segmentos = segmentosDeDona(ingresos, LARGO_DEL_CIRCULO, 3)

  let filaActiva: FilaDeDeporte | null = null
  for (const fila of filas) {
    if (fila.deporte === deporteActivo) filaActiva = fila
  }

  return (
    <section className="border-border bg-card rounded-2xl border p-6">
      <h2 className="mb-6 text-2xl font-semibold">Por deporte</h2>

      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)]">
        <div className="relative mx-auto size-52">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle
              cx="60"
              cy="60"
              r={RADIO}
              fill="none"
              strokeWidth="14"
              className="stroke-muted"
            />
            {filas.map((fila, i) => (
              <circle
                key={fila.deporte}
                cx="60"
                cy="60"
                r={RADIO}
                fill="none"
                strokeWidth={fila.deporte === deporteActivo ? 18 : 14}
                strokeDasharray={`${segmentos[i].largo} ${LARGO_DEL_CIRCULO}`}
                strokeDashoffset={-segmentos[i].inicio}
                className={`${trazoDelDeporte[fila.deporte]} transition-[stroke-width,opacity] duration-300 ${deporteActivo !== null && fila.deporte !== deporteActivo ? 'opacity-25' : ''}`}
              />
            ))}
          </svg>
          {/* Al medio: el total, o el deporte que está bajo el mouse */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              {filaActiva ? deporteLabels[filaActiva.deporte] : 'Ingresos'}
            </span>
            <span className="text-2xl font-semibold whitespace-nowrap">
              {formatPrecio(filaActiva ? filaActiva.ingresos : ingresosTotales)}
            </span>
            {filaActiva && (
              <span className="text-muted-foreground text-sm">
                {porcentaje(filaActiva.ingresos, ingresosTotales)}% del total
              </span>
            )}
          </div>
        </div>

        <ul className="space-y-2">
          {filas.map((fila) => (
            <li key={fila.deporte}>
              <Link
                href={fila.href}
                scroll={false}
                onMouseEnter={() => setDeporteActivo(fila.deporte)}
                onMouseLeave={() => setDeporteActivo(null)}
                onFocus={() => setDeporteActivo(fila.deporte)}
                onBlur={() => setDeporteActivo(null)}
                className={
                  fila.deporte === deporteActivo
                    ? 'bg-muted group flex items-center gap-3 rounded-xl p-3 transition-colors sm:gap-4'
                    : 'group flex items-center gap-3 rounded-xl p-3 transition-colors sm:gap-4'
                }
              >
                <SportIcon deporte={fila.deporte} className="size-8" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold whitespace-nowrap">
                    {deporteLabels[fila.deporte]}
                  </p>
                  <p className="text-muted-foreground flex flex-wrap gap-x-2 text-sm">
                    <span className="whitespace-nowrap">{formatPrecio(fila.ingresos)}</span>
                    <span className="whitespace-nowrap">
                      {fila.turnosReservados.toLocaleString('es-AR')} turnos
                    </span>
                  </p>
                </div>
                <ProgressRing
                  porcentaje={fila.porcentaje}
                  className="size-14"
                  claseFondo="stroke-muted"
                  claseRelleno={trazoDelDeporte[fila.deporte]}
                >
                  <span className="text-sm font-semibold">{fila.porcentaje}%</span>
                </ProgressRing>
                <ChevronRight className="text-muted-foreground hidden size-5 shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
