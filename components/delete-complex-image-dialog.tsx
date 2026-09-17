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

export function DeleteComplexImageDialog({
  complejoId,
  imageId,
  onDeleted,
}: {
  complejoId: string
  imageId: string
  onDeleted: () => void
}) {
  const [error, setError] = useState('')
  const [borrando, setBorrando] = useState(false)

  async function handleDelete() {
    setError('')
    setBorrando(true)
    const res = await fetch(`/api/complexes/${complejoId}/images/${imageId}`, {
      method: 'DELETE',
    })
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
      <AlertDialogTrigger
        render={<Button variant="destructive" size="icon-xs" aria-label="Quitar foto" />}
      >
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Quitar esta foto?</AlertDialogTitle>
          <AlertDialogDescription>
            Se borra de forma permanente. Si es la portada, la siguiente foto pasa a ser la portada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={borrando}>
            {borrando ? 'Quitando...' : 'Sí, quitar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
