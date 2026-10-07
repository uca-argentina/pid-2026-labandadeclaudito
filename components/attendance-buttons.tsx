'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AttendanceButtons({
  bookingId,
  asistio,
}: {
  bookingId: string
  asistio: boolean | null
}) {
  const router = useRouter()
  const [marcando, setMarcando] = useState(false)
  const [error, setError] = useState('')

  async function marcar(nuevoValor: boolean) {
    setError('')
    setMarcando(true)

    const res = await fetch(`/api/bookings/${bookingId}/attendance`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asistio: nuevoValor }),
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

  // En pantallas angostas la tabla del historial no tiene lugar para el texto:
  // se ven solo los íconos (el title y el aria-label dicen qué hace cada uno).
  return (
    <div className="text-right">
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant={asistio === true ? 'default' : 'outline'}
          onClick={() => marcar(true)}
          disabled={marcando}
          title="Asistió"
          aria-label="Asistió"
        >
          <Check className="size-3.5" />
          <span className="hidden 2xl:inline">Asistió</span>
        </Button>
        <Button
          size="sm"
          variant={asistio === false ? 'destructive' : 'outline'}
          onClick={() => marcar(false)}
          disabled={marcando}
          title="No asistió"
          aria-label="No asistió"
        >
          <X className="size-3.5" />
          <span className="hidden 2xl:inline">No asistió</span>
        </Button>
      </div>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  )
}
