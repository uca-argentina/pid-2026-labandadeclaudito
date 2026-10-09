'use client'

import { useEffect, useState } from 'react'
import { Hourglass } from 'lucide-react'
import { MINUTOS_PARA_PAGAR_SENA, formatearTiempoRestante } from '@/lib/estado-reserva'

const PLAZO_EN_MS = MINUTOS_PARA_PAGAR_SENA * 60 * 1000

// Cuenta regresiva en vivo del plazo para pagar la seña: el reloj baja de a un
// segundo y la barra se va vaciando. Cambia de color con la urgencia: verde,
// ámbar en los últimos 5 minutos y rojo (titilando) en el último minuto.
// Solo muestra el tiempo: lo que pasa cuando vence (liberar el turno y
// refrescar la pantalla) lo resuelve cada pantalla como hasta ahora.
export function CuentaRegresivaSena({ venceEn }: { venceEn: string }) {
  // null hasta que el componente arranca en el navegador: así el server no
  // dibuja una hora distinta a la del navegador.
  const [msRestantes, setMsRestantes] = useState<number | null>(null)

  useEffect(() => {
    // Se calcula siempre contra la hora real (no restando 1 por segundo): si
    // el navegador pausa la pestaña, al volver muestra el tiempo correcto.
    function actualizar() {
      setMsRestantes(new Date(venceEn).getTime() - Date.now())
    }
    actualizar()
    const id = setInterval(actualizar, 1000)
    return () => clearInterval(id)
  }, [venceEn])

  const restante = msRestantes ?? PLAZO_EN_MS
  const porcentaje = Math.min(Math.max((restante / PLAZO_EN_MS) * 100, 0), 100)
  const vencida = msRestantes !== null && restante <= 0

  let colorTexto = 'text-primary'
  let colorBarra = 'bg-primary'
  if (restante <= 60 * 1000) {
    colorTexto = 'text-destructive animate-pulse'
    colorBarra = 'bg-destructive'
  } else if (restante <= 5 * 60 * 1000) {
    colorTexto = 'text-amber-600 dark:text-amber-400'
    colorBarra = 'bg-amber-500'
  }

  return (
    <div role="timer" className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <Hourglass className="size-3.5 shrink-0" />
          {vencida ? 'Se venció el plazo de la seña' : 'Tiempo para pagar la seña'}
        </span>
        <span className={`font-heading text-xl font-bold tabular-nums ${colorTexto}`}>
          {msRestantes === null ? '--:--' : formatearTiempoRestante(restante)}
        </span>
      </div>
      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${colorBarra}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  )
}
