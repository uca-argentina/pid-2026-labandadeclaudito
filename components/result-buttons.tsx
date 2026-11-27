'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ResultButtons({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [marcando, setMarcando] = useState(false)
  const [error, setError] = useState('')

  async function responder(accion: 'CONFIRMAR' | 'OBSERVAR') {
    setError('')
    setMarcando(true)

    const res = await fetch(`/api/bookings/${bookingId}/result`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion }),
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
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant={'outline'}
          onClick={() => responder('CONFIRMAR')}
          disabled={marcando}
          title="Confirmar"
          aria-label="Confirmar"
        >
          <Check className="size-3.5" />
          <span className="hidden 2xl:inline">Confirmar</span>
        </Button>
        <Button
          size="sm"
          variant={'destructive'}
          onClick={() => responder('OBSERVAR')}
          disabled={marcando}
          title="Observar"
          aria-label="Observar"
        >
          <X className="size-3.5" />
          <span className="hidden 2xl:inline">Hacer una observacion</span>
        </Button>
      </div>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  )
}
