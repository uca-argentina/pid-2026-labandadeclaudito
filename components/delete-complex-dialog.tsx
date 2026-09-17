'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
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

export function DeleteComplexDialog({
  complejoId,
  complejoNombre,
  reservasFuturas,
}: {
  complejoId: string
  complejoNombre: string
  reservasFuturas: number
}) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [borrando, setBorrando] = useState(false)

  async function handleDelete() {
    setError('')
    setBorrando(true)
    const res = await fetch(`/api/complexes/${complejoId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dueno/complejos')
      router.refresh()
      return
    }
    const json = await res.json()
    setError(json.error)
    setBorrando(false)
  }

  let textoReservas = 'No tiene reservas futuras.'
  if (reservasFuturas === 1) {
    textoReservas = 'Se va a cancelar 1 reserva futura.'
  } else if (reservasFuturas > 1) {
    textoReservas = `Se van a cancelar ${reservasFuturas} reservas futuras.`
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Trash2 className="size-3.5" />
        Eliminar
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar &quot;{complejoNombre}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            Se despublica de la búsqueda de los jugadores junto con todas sus canchas y fotos.{' '}
            {textoReservas}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={borrando}>
            {borrando ? 'Eliminando...' : 'Sí, eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
