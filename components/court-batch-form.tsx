'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircleCheck, Info, Clock, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCourtSchema } from '@/lib/validations/court'
import { deporteLabels, superficieLabels } from '@/lib/labels'

const duracionOpciones: Record<string, string> = {
  '30': '30 minutos',
  '45': '45 minutos',
  '60': '60 minutos (estándar)',
  '90': '90 minutos',
  '120': '120 minutos',
}

function contarTurnos(horaApertura: string, horaCierre: string, duracionTurnoMin: number): number {
  const [ha, ma] = horaApertura.split(':').map(Number)
  const [hc, mc] = horaCierre.split(':').map(Number)
  const minutoInicio = ha * 60 + ma
  const minutoCierre = hc * 60 + mc
  if (!Number.isFinite(minutoInicio) || !Number.isFinite(minutoCierre) || duracionTurnoMin <= 0) return 0
  return Math.max(0, Math.floor((minutoCierre - minutoInicio) / duracionTurnoMin))
}

export function CourtBatchForm({ complejoId }: { complejoId: string }) {
  const router = useRouter()
  const [deporte, setDeporte] = useState<'FUTBOL_5' | 'FUTBOL_7' | 'FUTBOL_11'>('FUTBOL_5')
  const [tipoSuperficie, setTipoSuperficie] = useState<
    'CESPED_SINTETICO' | 'CESPED_NATURAL' | 'CEMENTO' | 'PARQUET'
  >('CESPED_SINTETICO')
  const [cantidad, setCantidad] = useState(1)
  const [horaApertura, setHoraApertura] = useState('08:00')
  const [horaCierre, setHoraCierre] = useState('23:00')
  const [duracionTurnoMin, setDuracionTurnoMin] = useState('60')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const turnosPorCancha = contarTurnos(horaApertura, horaCierre, Number(duracionTurnoMin))

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const form = new FormData(e.currentTarget)
    const datos = {
      nombrePrefijo: form.get('nombrePrefijo'),
      cantidad: form.get('cantidad'),
      deporte,
      tipoSuperficie,
      precioBase: form.get('precioBase'),
      horaApertura,
      horaCierre,
      duracionTurnoMin,
    }

    const parsed = createCourtSchema.safeParse(datos)
    if (!parsed.success) {
      setError('Revisá los datos, algo no es válido')
      return
    }

    setCargando(true)
    const res = await fetch(`/api/complexes/${complejoId}/courts`, {
      method: 'POST',
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="border-border bg-card rounded-2xl border p-6">
        <div className="border-border mb-4 flex items-center gap-2 border-b pb-2 text-base font-semibold">
          <Info className="size-4.5" />
          Datos de la cancha
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <Label htmlFor="nombrePrefijo">Nombre / prefijo identificador</Label>
            <Input id="nombrePrefijo" name="nombrePrefijo" placeholder="Cancha" defaultValue="Cancha" />
            <p className="text-muted-foreground text-xs">
              Ej: &quot;Cancha&quot; resultará en &quot;Cancha 1&quot;, &quot;Cancha 2&quot;...
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad de canchas a dar de alta</Label>
            <Input
              id="cantidad"
              name="cantidad"
              type="number"
              min={1}
              max={20}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
            <p className="text-muted-foreground text-xs">Crea cada registro individual en la base de datos</p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="precioBase">Precio base por turno ($ ARS)</Label>
            <Input id="precioBase" name="precioBase" type="number" step="0.01" placeholder="24000" />
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-2xl border p-6">
        <div className="border-border mb-4 flex items-center gap-2 border-b pb-2 text-base font-semibold">
          <Clock className="size-4.5" />
          Horarios disponibles
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="horaApertura">Apertura</Label>
            <Input
              id="horaApertura"
              name="horaApertura"
              type="time"
              value={horaApertura}
              onChange={(e) => setHoraApertura(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="horaCierre">Cierre</Label>
            <Input
              id="horaCierre"
              name="horaCierre"
              type="time"
              value={horaCierre}
              onChange={(e) => setHoraCierre(e.target.value)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="duracionTurnoMin">Duración de turno</Label>
            <Select value={duracionTurnoMin} onValueChange={(v) => v && setDuracionTurnoMin(v)}>
              <SelectTrigger className="w-full">
                <SelectValue>{(v: string) => duracionOpciones[v]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(duracionOpciones).map(([valor, label]) => (
                  <SelectItem key={valor} value={valor}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-secondary border-border text-secondary-foreground mt-4 flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm">
          <CircleCheck className="text-primary size-4 shrink-0" />
          <span>
            Se darán de alta <strong>{cantidad} {cantidad === 1 ? 'cancha individual' : 'canchas individuales'}</strong>{' '}
            con {turnosPorCancha} turnos de {duracionTurnoMin} min cada una.
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" render={<a href={`/dueno/complejos/${complejoId}/canchas`} />}>
          Cancelar
        </Button>
        <Button type="submit" disabled={cargando}>
          {cargando ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {cargando ? 'Guardando...' : 'Guardar canchas'}
        </Button>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </form>
  )
}
