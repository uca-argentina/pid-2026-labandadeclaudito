'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, Save } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TimeSelect } from '@/components/time-select'
import { FranjaDelDia } from '@/components/franja-del-dia'
import { finDeFranjaPorDefecto, franjaDentroDelHorario, mensajeFueraDelHorario } from '@/lib/time'
import { createBlockSchema, type CreateBlockInput } from '@/lib/validations/block'

type BloqueoExistente = {
  id: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  reason: string
}

export function BlockForm({
  complejoId,
  courtId,
  horaApertura,
  horaCierre,
  block,
}: {
  complejoId: string
  courtId: string
  horaApertura: string
  horaCierre: string
  block?: BloqueoExistente
}) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [cargando, setCargando] = useState(false)
  const [horaDesde, setHoraDesde] = useState(block?.startTime ?? horaApertura)
  const [horaHasta, setHoraHasta] = useState(
    block?.endTime ?? finDeFranjaPorDefecto(horaApertura, horaCierre),
  )
  // Si el bloqueo pisa reservas, la API no lo guarda hasta que el dueño confirma
  const [aConfirmar, setAConfirmar] = useState<{
    datos: CreateBlockInput
    reservas: number
  } | null>(null)

  async function guardar(datos: CreateBlockInput, confirmar: boolean) {
    setCargando(true)
    const url = block ? `/api/blocks/${block.id}` : `/api/courts/${courtId}/blocks`
    const res = await fetch(url, {
      method: block ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, confirmar }),
    })
    if (res.ok) {
      router.push(`/dueno/complejos/${complejoId}/canchas/${courtId}/bloqueos`)
      router.refresh()
      return
    }
    const json = await res.json()
    if (json.reservasAfectadas) {
      setAConfirmar({ datos, reservas: json.reservasAfectadas })
    } else {
      setError(json.error)
    }
    setCargando(false)
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const motivo = form.get('reason') as string
    const datos = {
      startDate: form.get('startDate'),
      endDate: form.get('endDate'),
      startTime: horaDesde,
      endTime: horaHasta,
      reason: motivo === '' ? undefined : motivo,
    }

    const parsed = createBlockSchema.safeParse(datos)
    if (!parsed.success) {
      const errores = parsed.error.flatten().fieldErrors
      setFieldErrors(
        Object.fromEntries(
          Object.entries(errores).map(([campo, mensajes]) => [campo, mensajes?.[0] ?? '']),
        ),
      )
      return
    }

    // La API hace el mismo chequeo; acá es para avisar sin ir al servidor
    const { startTime, endTime } = parsed.data
    if (!franjaDentroDelHorario(startTime, endTime, horaApertura, horaCierre)) {
      setFieldErrors({ endTime: mensajeFueraDelHorario(horaApertura, horaCierre) })
      return
    }

    await guardar(parsed.data, false)
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="bg-card shadow-card space-y-4 rounded-3xl p-6">
          <p className="text-muted-foreground text-sm">
            Esta cancha abre de {horaApertura} a {horaCierre}.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Desde</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={block?.startDate}
                aria-invalid={!!fieldErrors.startDate}
                className={
                  fieldErrors.startDate
                    ? 'border-destructive ring-destructive/20 ring-3'
                    : undefined
                }
              />
              {fieldErrors.startDate && (
                <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                  <AlertCircle className="size-3.5" />
                  {fieldErrors.startDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Hasta</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={block?.endDate}
                aria-invalid={!!fieldErrors.endDate}
                className={
                  fieldErrors.endDate ? 'border-destructive ring-destructive/20 ring-3' : undefined
                }
              />
              {fieldErrors.endDate && (
                <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                  <AlertCircle className="size-3.5" />
                  {fieldErrors.endDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Horario desde</Label>
              <TimeSelect
                label="Horario desde"
                value={horaDesde}
                onChange={setHoraDesde}
                invalid={!!fieldErrors.startTime}
              />
              {fieldErrors.startTime && (
                <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                  <AlertCircle className="size-3.5" />
                  {fieldErrors.startTime}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Horario hasta</Label>
              <TimeSelect
                label="Horario hasta"
                value={horaHasta}
                onChange={setHoraHasta}
                invalid={!!fieldErrors.endTime}
              />
              {fieldErrors.endTime && (
                <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                  <AlertCircle className="size-3.5" />
                  {fieldErrors.endTime}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo (Unicamente visible para su rol)</Label>
            <Input
              id="reason"
              name="reason"
              placeholder="Ej: mantenimiento de red"
              defaultValue={block?.reason}
            />
          </div>

          <p className="text-muted-foreground text-xs">
            El horario se bloquea todos los días entre las dos fechas. Si hay reservas en ese rango,
            antes de guardar te avisamos cuántas se cancelan.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            render={<a href={`/dueno/complejos/${complejoId}/canchas/${courtId}/bloqueos`} />}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={cargando}>
            {cargando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {cargando ? 'Guardando...' : 'Guardar bloqueo'}
          </Button>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <AlertDialog
          open={aConfirmar !== null}
          onOpenChange={(abierto) => !abierto && setAConfirmar(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cancelar las reservas de ese horario?</AlertDialogTitle>
              <AlertDialogDescription>
                {aConfirmar?.reservas === 1
                  ? 'Hay 1 reserva'
                  : `Hay ${aConfirmar?.reservas} reservas`}{' '}
                en ese horario. Si guardás el bloqueo se cancelan y a los jugadores se les devuelve
                la seña.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Volver</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={cargando}
                onClick={() => aConfirmar && guardar(aConfirmar.datos, true)}
              >
                {cargando ? 'Guardando...' : 'Sí, bloquear y cancelar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>

      <aside className="order-first lg:sticky lg:top-6 lg:order-none lg:self-start">
        <div className="bg-card shadow-card space-y-4 rounded-3xl p-6">
          <p className="bg-muted inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold">
            Vista previa
          </p>
          <p className="text-sm">
            Cada día del rango, de <span className="font-semibold">{horaDesde}</span> a{' '}
            <span className="font-semibold">{horaHasta}</span> no se va a poder reservar.
          </p>
          <FranjaDelDia
            horaApertura={horaApertura}
            horaCierre={horaCierre}
            desde={horaDesde}
            hasta={horaHasta}
            color="destructive"
          />
        </div>
      </aside>
    </div>
  )
}
