'use client'

import { useEffect, useState } from 'react'
import type { EstadoReserva } from '@/lib/generated/prisma/client'
import type { EstadoVisible } from '@/lib/estado-reserva'
import { estadoDeReserva } from '@/lib/estado-reserva'
import { estadoVisibleLabels } from '@/lib/labels'
import { momentoActual } from '@/lib/time'

const estilos: Record<EstadoVisible, string> = {
  PENDIENTE: 'bg-accent text-accent-foreground',
  CONFIRMADA: 'bg-primary/15 text-primary',
  EN_CURSO: 'bg-primary text-primary-foreground',
  FINALIZADA: 'bg-muted text-muted-foreground',
  ASISTIO: 'bg-green-600/15 text-green-700 dark:text-green-500',
  NO_SHOW: 'bg-destructive/15 text-destructive',
  CANCELADA: 'bg-destructive/15 text-destructive',
}

type Props = {
  estado: EstadoReserva
  asistio: boolean | null
  dia: string
  horaInicio: string
  horaFin: string
  // Lo calcula el server para que el primer render del cliente dé lo mismo y
  // React no se queje de la hidratación.
  ahoraInicial: { dia: string; hora: string }
}

export function BookingStatusBadge({
  estado,
  asistio,
  dia,
  horaInicio,
  horaFin,
  ahoraInicial,
}: Props) {
  const [ahora, setAhora] = useState(ahoraInicial)

  // El estado depende del reloj, así que se recalcula solo mientras la página
  // está abierta. No le pide nada al server: es una función pura sobre datos
  // que ya están en el cliente.
  useEffect(() => {
    const id = setInterval(() => setAhora(momentoActual()), 30_000)
    return () => clearInterval(id)
  }, [])

  const visible = estadoDeReserva({ estado, asistio, dia, horaInicio, horaFin }, ahora)

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estilos[visible]}`}>
      {estadoVisibleLabels[visible]}
    </span>
  )
}
