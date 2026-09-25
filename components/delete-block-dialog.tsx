'use client'

import { useState } from 'react'
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

export function DeleteBlockDialog({
  blockId,
  onDeleted,
}: {
  blockId: string
  onDeleted: () => void
}) {
  const [error, setError] = useState('')
  const [borrando, setBorrando] = useState(false)

  async function handleDelete() {
    setError('')
    setBorrando(true)
    const res = await fetch(`/api/blocks/${blockId}`, { method: 'DELETE' })
    if (res.ok) {
      onDeleted()
      return
    }
    const json = await res.json()
    setError(json.error)
    setBorrando(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Trash2 className="size-3.5" />
        Eliminar
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este bloqueo?</AlertDialogTitle>
          <AlertDialogDescription>
            El horario vuelve a estar disponible para reservar. Las reservas que ya se cancelaron al
            crear el bloqueo no se restauran solas.
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
