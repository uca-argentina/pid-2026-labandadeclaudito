'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Slot = { horaInicio: string; disponible: boolean }

function sumarMinutos(hora: string, minutos: number): string {
  const [h, m] = hora.split(':').map(Number)
  const total = h * 60 + m + minutos
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function CourtSlotPicker({
  courtId,
  courtName,
  courtSportLabel,
  duracionTurnoMin,
}: {
  courtId: string
  courtName: string
  courtSportLabel: string
  duracionTurnoMin: number
}) {
  const [fecha, setFecha] = useState(() => new Date())
  const [slots, setSlots] = useState<Slot[]>([])
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [confirmando, setConfirmando] = useState(false)

  async function cargarDisponibilidad(fechaConsultada: Date) {
    const fechaISO = format(fechaConsultada, 'yyyy-MM-dd')
    const res = await fetch(`/api/courts/${courtId}/availability?fecha=${fechaISO}`)
    const json = await res.json()
    if (res.ok) setSlots(json.slots)
  }

  useEffect(() => {
    let ignore = false
    const fechaISO = format(fecha, 'yyyy-MM-dd')
    fetch(`/api/courts/${courtId}/availability?fecha=${fechaISO}`)
      .then((res) => res.json())
      .then((json) => {
        if (!ignore) setSlots(json.slots)
      })
    return () => {
      ignore = true
    }
  }, [fecha, courtId])

  async function confirmarReserva() {
    if (!horaSeleccionada) return
    setMensaje('')
    setConfirmando(true)
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
      setMensaje(`Reservaste ${courtName} a las ${horaSeleccionada} hs`)
      setHoraSeleccionada(null)
      await cargarDisponibilidad(fecha)
      setConfirmando(false)
      return
    }
    setMensaje(json.error)
    setConfirmando(false)
  }

  return (
    <div className="border-border flex flex-col gap-3.5 border-t pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
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
            value={format(fecha, 'yyyy-MM-dd')}
            onChange={(e) => {
              setFecha(new Date(`${e.target.value}T00:00:00`))
              setHoraSeleccionada(null)
            }}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          />
        </div>
        <span className="text-muted-foreground text-xs">Turnos de {courtName}:</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
        {slots.map((slot) => {
          const seleccionado = slot.horaInicio === horaSeleccionada
          return (
            <button
              key={slot.horaInicio}
              type="button"
              disabled={!slot.disponible}
              onClick={() => setHoraSeleccionada(slot.horaInicio)}
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

      {horaSeleccionada && (
        <div className="bg-secondary border-border flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
          <div className="text-sm">
            Turno en{' '}
            <strong>
              {courtName} ({courtSportLabel})
            </strong>
            : {capitalizar(format(fecha, 'EEEE dd/MM', { locale: es }))} · {horaSeleccionada} a{' '}
            {sumarMinutos(horaSeleccionada, duracionTurnoMin)} hs
          </div>
          <Button onClick={confirmarReserva} disabled={confirmando}>
            <Check className="size-3.5" />
            {confirmando ? 'Confirmando...' : 'Confirmar reserva'}
          </Button>
        </div>
      )}

      {mensaje && <p className="text-sm">{mensaje}</p>}
    </div>
  )
}
