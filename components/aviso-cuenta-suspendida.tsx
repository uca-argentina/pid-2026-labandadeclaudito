'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// El reclamo es simulado: no se guarda nada, solo se avisa en pantalla.
export function AvisoCuentaSuspendida() {
  const [reclamoEnviado, setReclamoEnviado] = useState(false)

  return (
    <>
      <p className="bg-destructive/10 text-destructive rounded-xl px-3.5 py-2.5 text-sm font-medium">
        Tu cuenta está suspendida. Si creés que es un error, contactá a{' '}
        {/* type="button": el aviso va adentro del form del login y si no lo enviaría */}
        <button
          type="button"
          onClick={() => setReclamoEnviado(true)}
          className="cursor-pointer font-semibold underline underline-offset-4 hover:no-underline"
        >
          TocaYJuga
        </button>
        .
      </p>

      <Dialog open={reclamoEnviado} onOpenChange={setReclamoEnviado}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ya avisamos a TocaYJuga</DialogTitle>
            <DialogDescription>
              Tu reclamo quedó registrado. Un administrador va a revisar la suspensión de tu cuenta
              y te responde por email.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setReclamoEnviado(false)}>Entendido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
