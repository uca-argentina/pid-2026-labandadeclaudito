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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function DeletePriceDialog({
  priceId,
  onDeleted,
}: {
  priceId: string
  onDeleted: () => void
}) {
  const [error, setError] = useState('')
  const [borrando, setBorrando] = useState(false)

  async function handleDelete() {
    setError('')
    setBorrando(true)
    const res = await fetch(`/api/prices/${priceId}`, { method: 'DELETE' })
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
      <Tooltip>
        <TooltipTrigger
          render={
            <AlertDialogTrigger
              render={<Button variant="destructive" size="icon-sm" aria-label="Eliminar precio" />}
            />
          }
        >
          <Trash2 />
        </TooltipTrigger>
        <TooltipContent>Eliminar</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este precio especial?</AlertDialogTitle>
          <AlertDialogDescription>
            Los turnos vuelven a cobrarse al precio base de la cancha. Las reservas ya hechas con
            este precio no cambian (quedó congelado al reservar).
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
