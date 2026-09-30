'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AttendanceButtons({
  bookingId,
  asistio,
}: {
  bookingId: string
  asistio: boolean | null
}) {
  const router = useRouter()
  const [marcando, setMarcando] = useState(false)
  const [error, setError] = useState('')

  async function marcar(nuevoValor: boolean) {
    setError('')
    setMarcando(true)

    const res = await fetch(`/api/bookings/${bookingId}/attendance`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asistio: nuevoValor }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setMarcando(false)
      return
    }

    router.refresh()
    setMarcando(false)
  }

  return (
    <div className="text-right">
      <p className="text-muted-foreground mb-1 text-xs">¿Se presentó el jugador?</p>
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant={asistio === true ? 'default' : 'outline'}
          onClick={() => marcar(true)}
          disabled={marcando}
        >
          <Check className="size-3.5" />
          Asistió
        </Button>
        <Button
          size="sm"
          variant={asistio === false ? 'destructive' : 'outline'}
          onClick={() => marcar(false)}
          disabled={marcando}
        >
          <X className="size-3.5" />
          No asistió
        </Button>
      </div>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  )
}
