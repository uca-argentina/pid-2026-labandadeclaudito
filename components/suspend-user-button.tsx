'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export function SuspendUserButton({
  userId,
  userName,
  activo,
}: {
  userId: string
  userName: string
  activo: boolean
}) {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function cambiarActivo() {
    setError('')
    setGuardando(true)

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !activo }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setGuardando(false)
      return
    }

    router.refresh()
    setGuardando(false)
  }

  // Reactivar no tiene nada que confirmar: no cancela nada.
  if (!activo) {
    return (
      <div className="text-right">
        <Button size="sm" variant="outline" onClick={cambiarActivo} disabled={guardando}>
          Reactivar
        </Button>
        {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
      </div>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button size="sm" variant="destructive" />}>
        Suspender
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Suspender a {userName}?</AlertDialogTitle>
          <AlertDialogDescription>
            No va a poder iniciar sesión y pierde la sesión que tenga abierta. Se cancelan sus
            reservas que todavía no se jugaron (si es dueño, las de sus canchas) y se devuelven las
            señas. Reactivar la cuenta no recupera esas reservas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={cambiarActivo} disabled={guardando}>
            {guardando ? 'Suspendiendo...' : 'Sí, suspender'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
