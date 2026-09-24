'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Check, CheckCircle2, Loader2, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrecio } from '@/lib/labels'
import { diaDeHoy, sumarMinutos } from '@/lib/time'

type Slot = { horaInicio: string; disponible: boolean; precio: string }
type EstadoConfirmacion = 'idle' | 'procesando' | 'exito' | 'error'

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function CourtSlotPicker({
  courtId,
  courtName,
  duracionTurnoMin,
}: {
  courtId: string
  courtName: string
  duracionTurnoMin: number
}) {
  const [fecha, setFecha] = useState(() => new Date())
  const [slots, setSlots] = useState<Slot[]>([])
  const [cargando, setCargando] = useState(true)
  const [porcentajeSena, setPorcentajeSena] = useState(0)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null)
  const [estado, setEstado] = useState<EstadoConfirmacion>('idle')
  const [mensajeError, setMensajeError] = useState('')
  const [reciboExito, setReciboExito] = useState<{ hora: string; montoSena: number } | null>(null)

  async function cargarDisponibilidad(fechaConsultada: Date) {
    const fechaISO = format(fechaConsultada, 'yyyy-MM-dd')
    const res = await fetch(`/api/courts/${courtId}/availability?fecha=${fechaISO}`)
    const json = await res.json()
    if (res.ok) {
      setSlots(json.slots)
      setPorcentajeSena(json.porcentajeSena)
    }
  }

  useEffect(() => {
    let ignore = false
    const fechaISO = format(fecha, 'yyyy-MM-dd')
    fetch(`/api/courts/${courtId}/availability?fecha=${fechaISO}`)
      .then((res) => res.json())
      .then((json) => {
        if (ignore) return
        setSlots(json.slots)
        setPorcentajeSena(json.porcentajeSena)
        setCargando(false)
      })
    return () => {
      ignore = true
    }
  }, [fecha, courtId])

  const slotSeleccionado = slots.find((slot) => slot.horaInicio === horaSeleccionada)
  const montoSenaSeleccionada = slotSeleccionado
    ? (Number(slotSeleccionado.precio) * porcentajeSena) / 100
    : 0

  async function confirmarReserva() {
    if (!horaSeleccionada || !slotSeleccionado) return
    setMensajeError('')
    setEstado('procesando')

    // Delay artificial: acá "se simula" el cobro de la seña antes de pegarle
    // al endpoint real (que ya calcula y congela todo del lado del server).
    await new Promise((resolve) => setTimeout(resolve, 900))

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        canchaId: courtId,
        fecha: format(fecha, 'yyyy-MM-dd'),
        horaInicio: horaSeleccionada,
      }),
    })
    const json = await res.json()
    if (res.ok) {
      setReciboExito({ hora: horaSeleccionada, montoSena: montoSenaSeleccionada })
      setHoraSeleccionada(null)
      setEstado('exito')
      await cargarDisponibilidad(fecha)
      return
    }
    setMensajeError(json.error)
    setEstado('error')
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2">
        <label
          htmlFor={`fecha-${courtId}`}
          className="flex items-center gap-1.5 text-sm font-medium"
        >
          <Calendar className="size-3.5" />
          Fecha:
        </label>
        <input
          id={`fecha-${courtId}`}
          type="date"
          min={diaDeHoy()}
          value={format(fecha, 'yyyy-MM-dd')}
          onChange={(e) => {
            setFecha(new Date(`${e.target.value}T00:00:00`))
            setCargando(true)
            setHoraSeleccionada(null)
            setEstado('idle')
            setReciboExito(null)
          }}
          className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
        />
      </div>

      {cargando ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
          {slots.map((slot) => {
            const seleccionado = slot.horaInicio === horaSeleccionada
            return (
              <button
                key={slot.horaInicio}
                type="button"
                disabled={!slot.disponible}
                onClick={() => {
                  setHoraSeleccionada(slot.horaInicio)
                  setEstado('idle')
                  setMensajeError('')
                }}
                className={
                  !slot.disponible
                    ? 'bg-secondary text-muted-foreground h-9 cursor-not-allowed rounded-lg border text-sm font-medium line-through opacity-45'
                    : seleccionado
                      ? 'bg-primary text-primary-foreground border-primary h-9 rounded-lg border text-sm font-semibold'
                      : 'border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground h-9 rounded-lg border text-sm font-medium transition-colors'
                }
              >
                {slot.horaInicio}
              </button>
            )
          })}
        </div>
      )}

      {horaSeleccionada && slotSeleccionado && (
        <div className="bg-secondary border-border flex flex-col gap-3 rounded-lg border px-4 py-3">
          <div className="text-sm font-medium">
            {capitalizar(format(fecha, 'EEEE dd/MM', { locale: es }))} · {horaSeleccionada} a{' '}
            {sumarMinutos(horaSeleccionada, duracionTurnoMin)} hs
          </div>

          <div className="bg-primary/10 border-primary/30 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3.5 py-3">
            <div className="flex items-center gap-2">
              <Wallet className="text-primary size-4" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">Seña a pagar ahora</span>
                  <Badge variant="secondary">{porcentajeSena}%</Badge>
                </div>
                <span className="text-muted-foreground text-xs">
                  El resto ({formatPrecio(Number(slotSeleccionado.precio) - montoSenaSeleccionada)})
                  se paga en la cancha
                </span>
              </div>
            </div>
            <span className="text-primary text-xl font-bold">
              {formatPrecio(montoSenaSeleccionada)}
            </span>
          </div>

          <Button
            onClick={confirmarReserva}
            disabled={estado === 'procesando'}
            className="self-end"
          >
            {estado === 'procesando' ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            {estado === 'procesando' ? 'Pagando seña...' : 'Confirmar y pagar seña'}
          </Button>
        </div>
      )}

      {estado === 'exito' && reciboExito && (
        <div className="border-primary/30 bg-primary/10 flex items-center gap-2.5 rounded-lg border px-4 py-3">
          <CheckCircle2 className="text-primary size-5 shrink-0" />
          <p className="text-sm">
            Reservaste {courtName} a las {reciboExito.hora} hs — seña de{' '}
            <strong>{formatPrecio(reciboExito.montoSena)}</strong> pagada (simulado).
          </p>
        </div>
      )}

      {estado === 'error' && mensajeError && (
        <p className="text-destructive text-sm">{mensajeError}</p>
      )}
    </div>
  )
}
