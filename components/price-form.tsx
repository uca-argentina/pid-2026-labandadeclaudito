'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TimeSelect } from '@/components/time-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createPriceSchema } from '@/lib/validations/price'

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const TODOS_LOS_DIAS = 'todos'

type PrecioExistente = {
  id: string
  diaSemana: number | null
  horaInicio: string | null
  horaFin: string | null
  precio: string
}

export function PriceForm({
  complejoId,
  courtId,
  precioEspecial,
}: {
  complejoId: string
  courtId: string
  precioEspecial?: PrecioExistente
}) {
  const router = useRouter()
  const [diaSemana, setDiaSemana] = useState(
    precioEspecial?.diaSemana === null || precioEspecial?.diaSemana === undefined
      ? TODOS_LOS_DIAS
      : String(precioEspecial.diaSemana),
  )
  const [conFranjaHoraria, setConFranjaHoraria] = useState(precioEspecial?.horaInicio != null)
  const [horaInicio, setHoraInicio] = useState(precioEspecial?.horaInicio ?? '08:00')
  const [horaFin, setHoraFin] = useState(precioEspecial?.horaFin ?? '23:00')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const datos = {
      diaSemana: diaSemana === TODOS_LOS_DIAS ? null : Number(diaSemana),
      horaInicio: conFranjaHoraria ? horaInicio : null,
      horaFin: conFranjaHoraria ? horaFin : null,
      precio: form.get('precio'),
    }

    const parsed = createPriceSchema.safeParse(datos)
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
    const url = precioEspecial
      ? `/api/prices/${precioEspecial.id}`
      : `/api/courts/${courtId}/prices`
    const res = await fetch(url, {
      method: precioEspecial ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    if (res.ok) {
      router.push(`/dueno/complejos/${complejoId}/canchas/${courtId}/precios`)
      router.refresh()
      return
    }
    const json = await res.json()
    setError(json.error)
    setCargando(false)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label>Día</Label>
        <Select value={diaSemana} onValueChange={(v) => v && setDiaSemana(v)}>
          <SelectTrigger className="w-full" aria-label="Día">
            <SelectValue>
              {(v: string) => (v === TODOS_LOS_DIAS ? 'Todos los días' : diasSemana[Number(v)])}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS_LOS_DIAS}>Todos los días</SelectItem>
            {diasSemana.map((nombre, indice) => (
              <SelectItem key={indice} value={String(indice)}>
                {nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 font-normal">
          <input
            type="checkbox"
            checked={conFranjaHoraria}
            onChange={(e) => setConFranjaHoraria(e.target.checked)}
            className="accent-primary size-4"
          />
          Solo en una franja horaria (si no, aplica todo el día)
        </Label>
      </div>

      {conFranjaHoraria && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Desde</Label>
            <TimeSelect
              label="Desde"
              value={horaInicio}
              onChange={setHoraInicio}
              invalid={!!fieldErrors.horaInicio}
            />
            {fieldErrors.horaInicio && (
              <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                <AlertCircle className="size-3.5" />
                {fieldErrors.horaInicio}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Hasta</Label>
            <TimeSelect
              label="Hasta"
              value={horaFin}
              onChange={setHoraFin}
              invalid={!!fieldErrors.horaFin}
            />
            {fieldErrors.horaFin && (
              <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                <AlertCircle className="size-3.5" />
                {fieldErrors.horaFin}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="precio">Precio del turno ($ ARS)</Label>
        <Input
          id="precio"
          name="precio"
          type="number"
          step="0.01"
          defaultValue={precioEspecial?.precio}
          aria-invalid={!!fieldErrors.precio}
          className={
            fieldErrors.precio ? 'border-destructive ring-destructive/20 ring-3' : undefined
          }
        />
        {fieldErrors.precio && (
          <p className="text-destructive flex items-center gap-1 text-xs font-medium">
            <AlertCircle className="size-3.5" />
            {fieldErrors.precio}
          </p>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        Si un turno matchea con más de un precio especial, gana el más específico: franja horaria
        antes que solo día, y solo día antes que &quot;todos los días&quot;.
      </p>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          render={<a href={`/dueno/complejos/${complejoId}/canchas/${courtId}/precios`} />}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={cargando}>
          {cargando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {cargando ? 'Guardando...' : 'Guardar precio'}
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </form>
  )
}
