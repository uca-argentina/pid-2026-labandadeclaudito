'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBlockSchema } from '@/lib/validations/block'

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
  block,
}: {
  complejoId: string
  courtId: string
  block?: BloqueoExistente
}) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const motivo = form.get('reason') as string
    const datos = {
      startDate: form.get('startDate'),
      endDate: form.get('endDate'),
      startTime: form.get('startTime'),
      endTime: form.get('endTime'),
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

    setCargando(true)
    const url = block ? `/api/blocks/${block.id}` : `/api/courts/${courtId}/blocks`
    const res = await fetch(url, {
      method: block ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    if (res.ok) {
      router.push(`/dueno/complejos/${complejoId}/canchas/${courtId}/bloqueos`)
      router.refresh()
      return
    }
    const json = await res.json()
    setError(json.error)
    setCargando(false)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
              fieldErrors.startDate ? 'border-destructive ring-destructive/20 ring-3' : undefined
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
          <Label htmlFor="startTime">Horario desde</Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            defaultValue={block?.startTime}
            aria-invalid={!!fieldErrors.startTime}
            className={
              fieldErrors.startTime ? 'border-destructive ring-destructive/20 ring-3' : undefined
            }
          />
          {fieldErrors.startTime && (
            <p className="text-destructive flex items-center gap-1 text-xs font-medium">
              <AlertCircle className="size-3.5" />
              {fieldErrors.startTime}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Horario hasta</Label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            defaultValue={block?.endTime}
            aria-invalid={!!fieldErrors.endTime}
            className={
              fieldErrors.endTime ? 'border-destructive ring-destructive/20 ring-3' : undefined
            }
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
        El horario se bloquea todos los días entre las dos fechas. Si hay reservas confirmadas en
        ese rango, se cancelan automáticamente.
      </p>

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
    </form>
  )
}
