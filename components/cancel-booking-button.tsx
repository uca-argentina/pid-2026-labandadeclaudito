'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [cancelando, setCancelando] = useState(false)
  const [error, setError] = useState('')

  async function cancelar() {
    setError('')
    setCancelando(true)

    const res = await fetch(`/api/bookings/${bookingId}`, { method: 'PATCH' })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setCancelando(false)
      return
    }

    router.refresh()
    setCancelando(false)
  }

  return (
    <div className="text-right">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
          <X className="size-3.5" />
          Cancelar reserva
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar esta reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              El turno vuelve a quedar libre para otros jugadores. No se puede deshacer: si lo
              querés de nuevo, tenés que reservarlo otra vez.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction onClick={cancelar} disabled={cancelando}>
              {cancelando ? 'Cancelando...' : 'Sí, cancelar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  )
}
