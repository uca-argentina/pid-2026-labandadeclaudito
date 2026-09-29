'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrecio } from '@/lib/labels'

export function PayDepositButton({
  bookingId,
  montoSena,
}: {
  bookingId: string
  montoSena: string
}) {
  const router = useRouter()
  const [pagando, setPagando] = useState(false)
  const [error, setError] = useState('')

  async function pagar() {
    setError('')
    setPagando(true)

    // Delay artificial: "se simula" el cobro de la seña, no hay pasarela real.
    await new Promise((resolve) => setTimeout(resolve, 900))

    const res = await fetch(`/api/bookings/${bookingId}/deposit`, { method: 'POST' })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setPagando(false)
      return
    }

    router.refresh()
    setPagando(false)
  }

  return (
    <div className="text-right">
      <Button size="sm" onClick={pagar} disabled={pagando}>
        {pagando ? <Loader2 className="size-3.5 animate-spin" /> : <Wallet className="size-3.5" />}
        {pagando ? 'Pagando seña...' : `Pagar seña ${formatPrecio(montoSena)}`}
      </Button>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  )
}
