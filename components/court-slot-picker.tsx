'use client'

import { useEffect, useState } from 'react'
import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowRight, Calendar, Check, CheckCircle2, Clock, Loader2, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MINUTOS_PARA_PAGAR_SENA, venceLaSena } from '@/lib/estado-reserva'
import { CuentaRegresivaSena } from '@/components/cuenta-regresiva-sena'
import { formatPrecio } from '@/lib/labels'
import { diaDeHoy, formatAdvanceTime, ultimoDiaParaReservar } from '@/lib/time'

type Slot = { horaInicio: string; horaFin: string; disponible: boolean; precio: string }
// reservando -> pendiente (reserva creada, falta la seña) -> pagando -> exito
type EstadoConfirmacion = 'idle' | 'reservando' | 'pendiente' | 'pagando' | 'exito' | 'error'

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function CourtSlotPicker({
  courtId,
  courtName,
  precioBase,
  fechaInicial,
}: {
  courtId: string
  courtName: string
  precioBase: string
  fechaInicial?: string
}) {
  // fechaInicial viene como YYYY-MM-DD de la búsqueda. Se arma con parse (fecha
  // local): new Date('2026-10-03') sería medianoche UTC y en Argentina mostraría
  // el día anterior. Una fecha que ya pasó no sirve, se arranca en hoy.
  const [fecha, setFecha] = useState(() => {
    if (fechaInicial !== undefined && fechaInicial >= diaDeHoy()) {
      return parse(fechaInicial, 'yyyy-MM-dd', new Date())
    }
    return new Date()
  })
  const [slots, setSlots] = useState<Slot[]>([])
  const [cargando, setCargando] = useState(true)
  const [porcentajeSena, setPorcentajeSena] = useState(0)
  const [minAdvanceMinutes, setMinAdvanceMinutes] = useState(0)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null)
  const [estado, setEstado] = useState<EstadoConfirmacion>('idle')
  const [mensajeError, setMensajeError] = useState('')
  const [reservaHecha, setReservaHecha] = useState<{
    id: string
    hora: string
    montoSena: number
    venceEn: string
  } | null>(null)

  async function cargarDisponibilidad(fechaConsultada: Date) {
    const fechaISO = format(fechaConsultada, 'yyyy-MM-dd')
    const res = await fetch(`/api/courts/${courtId}/availability?fecha=${fechaISO}`)
    const json = await res.json()
    if (res.ok) {
      setSlots(json.slots)
      setPorcentajeSena(json.porcentajeSena)
      setMinAdvanceMinutes(json.minAdvanceMinutes)
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
        setMinAdvanceMinutes(json.minAdvanceMinutes)
        setCargando(false)
      })
    return () => {
      ignore = true
    }
  }, [fecha, courtId])

  // Grilla en vivo: cada 5 segundos vuelve a pedir la disponibilidad. Así, si
  // otro jugador reserva un turno, acá aparece tachado sin recargar la página.
  useEffect(() => {
    let activo = true
    const fechaISO = format(fecha, 'yyyy-MM-dd')
    const id = setInterval(async () => {
      const res = await fetch(`/api/courts/${courtId}/availability?fecha=${fechaISO}`)
      // Si mientras tanto cambió la fecha o se cerró, esta respuesta ya no sirve
      if (!activo || !res.ok) return
      const json = await res.json()
      setSlots(json.slots)
    }, 5000)
    return () => {
      activo = false
      clearInterval(id)
    }
  }, [fecha, courtId])

  // Si el jugador no paga la seña a tiempo: se avisa y se recarga la grilla,
  // donde el turno ya aparece libre. Es un temporizador del navegador, solo
  // mientras esta pantalla está abierta.
  useEffect(() => {
    if (!reservaHecha || estado === 'exito' || estado === 'pagando') return

    const msHastaVencer = new Date(reservaHecha.venceEn).getTime() - Date.now()
    const id = setTimeout(async () => {
      setReservaHecha(null)
      setMensajeError(
        `Se venció el plazo de ${MINUTOS_PARA_PAGAR_SENA} minutos para pagar la seña. El turno se liberó.`,
      )
      setEstado('error')

      const fechaISO = format(fecha, 'yyyy-MM-dd')
      const res = await fetch(`/api/courts/${courtId}/availability?fecha=${fechaISO}`)
      const json = await res.json()
      if (res.ok) {
        setSlots(json.slots)
      }
    }, msHastaVencer + 1000)

    return () => clearTimeout(id)
  }, [reservaHecha, estado, fecha, courtId])

  const slotSeleccionado = slots.find((slot) => slot.horaInicio === horaSeleccionada)
  // El turno elegido lo reservó otro jugador mientras lo miraba (lo trajo la grilla en vivo)
  const turnoElegidoSeOcupo = slotSeleccionado !== undefined && !slotSeleccionado.disponible
  const montoSenaSeleccionada = slotSeleccionado
    ? (Number(slotSeleccionado.precio) * porcentajeSena) / 100
    : 0

  // Paso 1: la reserva se crea PENDIENTE (de seña). El turno ya queda tomado.
  async function reservar() {
    if (!horaSeleccionada || !slotSeleccionado) return
    setMensajeError('')
    setEstado('reservando')

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
      setReservaHecha({
        id: json.reserva.id,
        hora: horaSeleccionada,
        montoSena: montoSenaSeleccionada,
        venceEn: venceLaSena(new Date(json.reserva.createdAt)).toISOString(),
      })
      setHoraSeleccionada(null)
      setEstado('pendiente')
      await cargarDisponibilidad(fecha)
      return
    }
    setMensajeError(json.error)
    setEstado('error')
  }

  // Paso 2: pagar la seña pasa la reserva a CONFIRMADA.
  async function pagarSena() {
    if (!reservaHecha) return
    setMensajeError('')
    setEstado('pagando')

    // Delay artificial: acá "se simula" el cobro de la seña, no hay pasarela
    // real. El monto lo calcula y congela el server.
    await new Promise((resolve) => setTimeout(resolve, 900))

    const res = await fetch(`/api/bookings/${reservaHecha.id}/deposit`, { method: 'POST' })
    const json = await res.json()
    if (res.ok) {
      setEstado('exito')
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
          max={ultimoDiaParaReservar()}
          value={format(fecha, 'yyyy-MM-dd')}
          onChange={(e) => {
            setFecha(new Date(`${e.target.value}T00:00:00`))
            setCargando(true)
            setHoraSeleccionada(null)
            setEstado('idle')
            setReservaHecha(null)
          }}
          className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
        />
        <span className="text-muted-foreground ml-auto flex items-center gap-1.5 text-xs">
          <span className="size-2 animate-pulse rounded-full bg-green-500" />
          En vivo
        </span>
      </div>

      {minAdvanceMinutes > 0 && (
        <p className="text-muted-foreground text-sm">
          Los turnos se reservan con al menos {formatAdvanceTime(minAdvanceMinutes)} de
          anticipación.
        </p>
      )}

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
            const esPrecioEspecial = slot.precio !== precioBase
            return (
              <button
                key={slot.horaInicio}
                type="button"
                disabled={!slot.disponible}
                onClick={() => {
                  // Si la reserva anterior ya quedó pagada, se olvida: si no,
                  // volvería a aparecer su "Pagar seña" con la cuenta regresiva.
                  // Si todavía está pendiente, se queda (falta pagarla).
                  if (estado === 'exito') setReservaHecha(null)
                  setHoraSeleccionada(slot.horaInicio)
                  setEstado('idle')
                  setMensajeError('')
                }}
                className={
                  !slot.disponible
                    ? 'bg-secondary text-muted-foreground flex h-9 cursor-not-allowed flex-col items-center justify-center rounded-lg border text-sm font-medium line-through opacity-45'
                    : seleccionado
                      ? 'bg-primary text-primary-foreground border-primary flex h-9 flex-col items-center justify-center rounded-lg border text-sm font-semibold'
                      : 'border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground flex h-9 flex-col items-center justify-center rounded-lg border text-sm font-medium transition-colors'
                }
              >
                {slot.horaInicio}
                {esPrecioEspecial && slot.disponible && (
                  <span className="text-[10px] leading-none font-normal opacity-80">
                    {formatPrecio(slot.precio)}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {turnoElegidoSeOcupo && (
        <p className="text-destructive text-sm">
          Otro jugador acaba de reservar las {horaSeleccionada}. Elegí otro horario.
        </p>
      )}

      {horaSeleccionada && slotSeleccionado && !turnoElegidoSeOcupo && (
        <div className="bg-secondary border-border flex flex-col gap-3 rounded-lg border px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium">
              {capitalizar(format(fecha, 'EEEE dd/MM', { locale: es }))} · {horaSeleccionada} a{' '}
              {slotSeleccionado.horaFin} hs
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Precio del turno:</span>
              <span className="font-semibold">{formatPrecio(slotSeleccionado.precio)}</span>
              {slotSeleccionado.precio !== precioBase && (
                <Badge variant="secondary">Precio especial</Badge>
              )}
            </div>
          </div>

          <div className="bg-primary/10 border-primary/30 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3.5 py-3">
            <div className="flex items-center gap-2">
              <Wallet className="text-primary size-4" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">Seña para confirmar</span>
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

          <Button onClick={reservar} disabled={estado === 'reservando'} className="self-end">
            {estado === 'reservando' ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            {estado === 'reservando' ? 'Reservando...' : 'Reservar'}
          </Button>
        </div>
      )}

      {reservaHecha && estado !== 'exito' && (
        <div className="bg-secondary border-border flex flex-col gap-3 rounded-lg border px-4 py-3">
          <div className="flex items-start gap-2.5">
            <Clock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">
                Reservaste {courtName} a las {reservaHecha.hora} hs
              </p>
              <p className="text-muted-foreground text-xs">
                Pagá la seña para confirmar el turno; si no, el turno se libera.
              </p>
            </div>
          </div>
          <CuentaRegresivaSena venceEn={reservaHecha.venceEn} />
          <Button onClick={pagarSena} disabled={estado === 'pagando'} className="self-end">
            {estado === 'pagando' ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Wallet className="size-3.5" />
            )}
            {estado === 'pagando'
              ? 'Pagando seña...'
              : `Pagar seña ${formatPrecio(reservaHecha.montoSena)}`}
          </Button>
        </div>
      )}

      {estado === 'exito' && reservaHecha && (
        <div className="border-primary/30 bg-primary/10 flex items-start gap-2.5 rounded-lg border px-4 py-3">
          <CheckCircle2 className="text-primary mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Reserva confirmada</p>
            <p className="text-muted-foreground text-xs">
              {courtName} a las {reservaHecha.hora} hs — seña de{' '}
              {formatPrecio(reservaHecha.montoSena)} pagada (simulado).
            </p>
            <Link
              href="/jugador/reservas"
              className="text-primary mt-2 inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              Ver mis reservas
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {estado === 'error' && mensajeError && (
        <p className="text-destructive text-sm">{mensajeError}</p>
      )}
    </div>
  )
}
