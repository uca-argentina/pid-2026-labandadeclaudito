'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { decidirComplejoSchema } from '@/lib/validations/complex'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function DecidirComplejo({
  complejoId,
  nombreComplejo,
}: {
  complejoId: string
  nombreComplejo: string
}) {
  const router = useRouter()
  const [rechazando, setRechazando] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function enviar(estadoAprobacion: 'APROBADO' | 'RECHAZADO') {
    setError('')

    let datos: { estadoAprobacion: 'APROBADO' | 'RECHAZADO'; motivoRechazo?: string } = {
      estadoAprobacion,
    }
    if (estadoAprobacion === 'RECHAZADO') {
      datos = { estadoAprobacion, motivoRechazo }
    }

    const parsed = decidirComplejoSchema.safeParse(datos)
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setGuardando(true)
    const res = await fetch(`/api/admin/complexes/${complejoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    const json = await res.json()
    setGuardando(false)

    if (!res.ok) {
      setError(json.error)
      return
    }

    setRechazando(false)
    router.refresh()
  }

  return (
    <div>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => enviar('APROBADO')}
          disabled={guardando}
        >
          <Check className="size-4" />
          Aprobar
        </Button>

        <Dialog open={rechazando} onOpenChange={setRechazando}>
          <DialogTrigger render={<Button size="sm" variant="outline" className="flex-1" />}>
            <X className="size-4" />
            Rechazar
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rechazar {nombreComplejo}</DialogTitle>
              <DialogDescription>
                El dueño lee este motivo, corrige el complejo y lo vuelve a mandar a revisión.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor={`motivo-${complejoId}`}>Qué tiene que corregir</Label>
              <Textarea
                id={`motivo-${complejoId}`}
                rows={4}
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                placeholder="Ej: la dirección no coincide con las fotos"
                aria-invalid={!!error}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm font-medium">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setRechazando(false)}>
                Volver
              </Button>
              <Button
                variant="destructive"
                onClick={() => enviar('RECHAZADO')}
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Rechazar complejo'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* El error de aprobar se ve acá; el de rechazar, adentro del diálogo */}
      {error && !rechazando && <p className="text-destructive mt-2 text-sm font-medium">{error}</p>}
    </div>
  )
}
