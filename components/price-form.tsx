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
import { finDeFranjaPorDefecto, franjaDentroDelHorario, mensajeFueraDelHorario } from '@/lib/time'
import { createPriceSchema } from '@/lib/validations/price'
import { formatPrecio, nombresDeDias } from '@/lib/labels'
import { FranjaDelDia } from '@/components/franja-del-dia'

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
  horaApertura,
  horaCierre,
  precioEspecial,
}: {
  complejoId: string
  courtId: string
  horaApertura: string
  horaCierre: string
  precioEspecial?: PrecioExistente
}) {
  const router = useRouter()
  const [diaSemana, setDiaSemana] = useState(
    precioEspecial?.diaSemana === null || precioEspecial?.diaSemana === undefined
      ? TODOS_LOS_DIAS
      : String(precioEspecial.diaSemana),
  )
  const [conFranjaHoraria, setConFranjaHoraria] = useState(precioEspecial?.horaInicio != null)
  const [horaInicio, setHoraInicio] = useState(precioEspecial?.horaInicio ?? horaApertura)
  const [horaFin, setHoraFin] = useState(
    precioEspecial?.horaFin ?? finDeFranjaPorDefecto(horaApertura, horaCierre),
  )
  // Controlado solo para mostrarlo en la vista previa; se sigue leyendo del form al guardar
  const [precio, setPrecio] = useState(precioEspecial?.precio ?? '')
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

    // La API hace el mismo chequeo; acá es para avisar sin ir al servidor
    const franja = parsed.data
    if (
      franja.horaInicio !== null &&
      !franjaDentroDelHorario(franja.horaInicio, franja.horaFin!, horaApertura, horaCierre)
    ) {
      setFieldErrors({ horaFin: mensajeFueraDelHorario(horaApertura, horaCierre) })
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
    <div className="grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="bg-card shadow-card space-y-4 rounded-3xl p-6">
          <p className="text-muted-foreground text-sm">
            Esta cancha abre de {horaApertura} a {horaCierre}.
          </p>

          <div className="space-y-2">
            <Label>Día</Label>
            <Select value={diaSemana} onValueChange={(v) => v && setDiaSemana(v)}>
              <SelectTrigger className="w-full" aria-label="Día">
                <SelectValue>
                  {(v: string) =>
                    v === TODOS_LOS_DIAS ? 'Todos los días' : nombresDeDias[Number(v)]
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS_LOS_DIAS}>Todos los días</SelectItem>
                {nombresDeDias.map((nombre, indice) => (
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
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
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
            Si un turno matchea con más de un precio especial, gana el más específico: franja
            horaria antes que solo día, y solo día antes que &quot;todos los días&quot;.
          </p>
        </div>

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

      <aside className="order-first lg:sticky lg:top-6 lg:order-none lg:self-start">
        <div className="bg-card shadow-card space-y-4 rounded-3xl p-6">
          <p className="bg-muted inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold">
            Vista previa
          </p>
          <div>
            <p className="text-sm font-medium">
              {diaSemana === TODOS_LOS_DIAS ? 'Todos los días' : nombresDeDias[Number(diaSemana)]}
              {conFranjaHoraria ? `, de ${horaInicio} a ${horaFin}` : ', todo el día'}
            </p>
            <p className="font-heading text-primary mt-1 text-3xl font-bold">
              {precio === '' ? 'Sin cargar' : formatPrecio(precio)}
            </p>
            <p className="text-muted-foreground text-sm">por turno</p>
          </div>
          <FranjaDelDia
            horaApertura={horaApertura}
            horaCierre={horaCierre}
            // Sin franja, el precio vale en todo el horario de la cancha: no se
            // dibuja franja encima, solo el horario de apertura.
            desde={conFranjaHoraria ? horaInicio : '00:00'}
            hasta={conFranjaHoraria ? horaFin : '00:00'}
            color="primary"
          />
        </div>
      </aside>
    </div>
  )
}
