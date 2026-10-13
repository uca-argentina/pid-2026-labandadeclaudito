'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrecio } from '@/lib/labels'

// className va al contenedor: la tarjeta decide cuánto ancho le da al botón.
export function PayDepositButton({
  bookingId,
  montoSena,
  className,
}: {
  bookingId: string
  montoSena: string
  className?: string
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
    <div className={className}>
      <Button size="sm" className="w-full" onClick={pagar} disabled={pagando}>
        {pagando && <Loader2 className="size-3.5 animate-spin" />}
        {pagando ? 'Pagando seña...' : `Pagar seña ${formatPrecio(montoSena)}`}
      </Button>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  )
}
