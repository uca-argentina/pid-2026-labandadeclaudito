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

// avisoSena: qué pasa con la seña si cancela ahora (lo calcula el server).
// null cuando la reserva no tiene seña pagada.
export function CancelBookingButton({
  bookingId,
  avisoSena,
}: {
  bookingId: string
  avisoSena: string | null
}) {
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
              El turno vuelve a quedar disponible para otros jugadores y esta acción no se puede
              deshacer. Si más adelante lo querés de nuevo, vas a tener que reservarlo otra vez.
            </AlertDialogDescription>
            {avisoSena && <p className="text-sm font-medium">{avisoSena}</p>}
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
