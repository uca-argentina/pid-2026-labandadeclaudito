'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Goal, Loader2, Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { resultBookingSchema } from '@/lib/validations/booking'

const MAX_CARACTERES_COMENTARIO = 20
export function ResultBookingDialog({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [resultado, setResultado] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar() {
    setError('')

    const parsed = resultBookingSchema.safeParse({ resultado })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setEnviando(true)
    const res = await fetch(`/api/bookings/${bookingId}/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setEnviando(false)
      return
    }

    setAbierto(false)
    setEnviando(false)
    router.refresh()
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Goal className="size-4" />
        Cargar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Cómo salió el partido?</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="flex flex-col items-center gap-2"></div>

          <div className="space-y-2">
            <Label htmlFor={`resultado-${bookingId}`}>Resultado</Label>
            <Textarea
              id={`resultado-${bookingId}`}
              rows={3}
              maxLength={MAX_CARACTERES_COMENTARIO}
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              placeholder="Ej: 3-2"
            />
            <p className="text-muted-foreground text-right text-xs">
              {resultado.length}/{MAX_CARACTERES_COMENTARIO}
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm font-medium">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setAbierto(false)}>
            Volver
          </Button>
          <Button onClick={enviar} disabled={enviando}>
            {enviando && <Loader2 className="size-4 animate-spin" />}
            {enviando ? 'Enviando...' : 'Enviar resultado'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
