'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DeleteCourtDialog } from '@/components/delete-court-dialog'
import { updateCourtSchema } from '@/lib/validations/court'
import { deporteLabels, superficieLabels } from '@/lib/labels'
import type { Cancha } from '@/lib/generated/prisma/client'

export function CourtEditForm({ complejoId, cancha }: { complejoId: string; cancha: Cancha }) {
  const router = useRouter()
  const [deporte, setDeporte] = useState(cancha.deporte)
  const [tipoSuperficie, setTipoSuperficie] = useState(cancha.tipoSuperficie)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const datos = {
      nombre: form.get('nombre'),
      deporte,
      tipoSuperficie,
      precioBase: form.get('precioBase'),
      horaApertura: form.get('horaApertura'),
      horaCierre: form.get('horaCierre'),
      duracionTurnoMin: form.get('duracionTurnoMin'),
    }

    const parsed = updateCourtSchema.safeParse(datos)
    if (!parsed.success) {
      const errores = parsed.error.flatten().fieldErrors
      setFieldErrors(
        Object.fromEntries(Object.entries(errores).map(([campo, mensajes]) => [campo, mensajes?.[0] ?? ''])),
      )
      return
    }

    setCargando(true)
    const res = await fetch(`/api/courts/${cancha.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    if (res.ok) {
      router.push(`/dueno/complejos/${complejoId}/canchas`)
      return
    }
    const json = await res.json()
    setError(json.error)
    setCargando(false)
  }

  return (
    <div className="space-y-8">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre identificador</Label>
            <Input
              id="nombre"
              name="nombre"
              defaultValue={cancha.nombre}
              aria-invalid={!!fieldErrors.nombre}
              className={fieldErrors.nombre ? 'border-destructive ring-destructive/20 ring-3' : undefined}
            />
            {fieldErrors.nombre && (
              <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                <AlertCircle className="size-3.5" />
                {fieldErrors.nombre}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Deporte</Label>
            <Select value={deporte} onValueChange={(v) => setDeporte(v as typeof deporte)}>
              <SelectTrigger className="w-full">
                <SelectValue>{(v: typeof deporte) => deporteLabels[v]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(deporteLabels).map(([valor, label]) => (
                  <SelectItem key={valor} value={valor}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Superficie</Label>
            <Select
              value={tipoSuperficie}
              onValueChange={(v) => setTipoSuperficie(v as typeof tipoSuperficie)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{(v: typeof tipoSuperficie) => superficieLabels[v]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(superficieLabels).map(([valor, label]) => (
                  <SelectItem key={valor} value={valor}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="precioBase"
              className={fieldErrors.precioBase ? 'text-destructive font-semibold' : undefined}
            >
              Precio base por turno ($ ARS) {fieldErrors.precioBase && '*'}
            </Label>
            <Input
              id="precioBase"
              name="precioBase"
              type="number"
              step="0.01"
              defaultValue={cancha.precioBase.toString()}
              aria-invalid={!!fieldErrors.precioBase}
              className={fieldErrors.precioBase ? 'border-destructive ring-destructive/20 ring-3' : undefined}
            />
            {fieldErrors.precioBase && (
              <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                <AlertCircle className="size-3.5" />
                {fieldErrors.precioBase}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="horaApertura">Apertura</Label>
            <Input id="horaApertura" name="horaApertura" type="time" defaultValue={cancha.horaApertura} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="horaCierre">Cierre</Label>
            <Input id="horaCierre" name="horaCierre" type="time" defaultValue={cancha.horaCierre} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duracionTurnoMin">Duración de turno (min)</Label>
            <Input
              id="duracionTurnoMin"
              name="duracionTurnoMin"
              type="number"
              min={30}
              max={180}
              defaultValue={cancha.duracionTurnoMin}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            render={<a href={`/dueno/complejos/${complejoId}/canchas`} />}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={cargando}>
            {cargando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {cargando ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}
      </form>

      <div className="border-destructive/40 flex items-center justify-between gap-4 rounded-2xl border border-dashed p-5">
        <div>
          <strong className="text-destructive text-sm">Eliminar esta cancha puntual</strong>
          <p className="text-muted-foreground mt-1 text-xs">
            Eliminará únicamente &quot;{cancha.nombre}&quot; sin afectar a las demás.
          </p>
        </div>
        <DeleteCourtDialog
          courtId={cancha.id}
          courtName={cancha.nombre}
          onDeleted={() => router.push(`/dueno/complejos/${complejoId}/canchas`)}
        />
      </div>
    </div>
  )
}
