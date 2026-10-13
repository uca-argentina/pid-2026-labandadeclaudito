'use client'

import { useEffect, useRef, useState } from 'react'
import { formatPrecio } from '@/lib/labels'

const DURACION_MS = 900

function formatear(valor: number, tipo: 'numero' | 'precio' | 'porcentaje'): string {
  if (tipo === 'precio') return formatPrecio(valor)
  if (tipo === 'porcentaje') return `${valor}%`
  return valor.toLocaleString('es-AR')
}

// Número que "cuenta" hasta su valor: al aparecer arranca de 0, y al cambiar
// de filtro va del número que se veía al nuevo. El valor real va aparte en
// sr-only: un lector de pantalla no lee la cuenta, lee el número.
export function AnimatedNumber({
  valor,
  tipo = 'numero',
}: {
  valor: number
  tipo?: 'numero' | 'precio' | 'porcentaje'
}) {
  const [mostrado, setMostrado] = useState(0)
  // Lo último que se dibujó: de ahí arranca la próxima cuenta
  const ultimoMostrado = useRef(0)

  useEffect(() => {
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desde = ultimoMostrado.current
    const inicio = performance.now()
    let pedido = 0

    function avanzar(ahora: number) {
      const progreso = sinMovimiento ? 1 : Math.min((ahora - inicio) / DURACION_MS, 1)
      // Arranca rápido y frena al final (ease-out), se siente más natural
      const suavizado = 1 - (1 - progreso) * (1 - progreso)
      const actual = Math.round(desde + (valor - desde) * suavizado)

      ultimoMostrado.current = actual
      setMostrado(actual)
      if (progreso < 1) {
        pedido = requestAnimationFrame(avanzar)
      }
    }

    pedido = requestAnimationFrame(avanzar)
    return () => cancelAnimationFrame(pedido)
  }, [valor])

  return (
    <>
      <span aria-hidden="true">{formatear(mostrado, tipo)}</span>
      <span className="sr-only">{formatear(valor, tipo)}</span>
    </>
  )
}
