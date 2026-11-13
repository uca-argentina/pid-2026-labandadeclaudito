'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { TimeSelect } from '@/components/time-select'
import { minutesToTimeText } from '@/lib/time'

// Campo de "preparacion minima" antes de tener una nueva reserva
export function MinPreparationInput({
  name,
  label,
  defaultMinutes,
  help,
  error,
  allowEmpty = false,
}: {
  name: string
  label: string
  defaultMinutes: number | null
  help: string
  error?: string
  allowEmpty?: boolean
}) {
  const [tieneValorPropio, setTieneValorPropio] = useState(defaultMinutes !== null)
  const [valor, setValor] = useState(
    defaultMinutes !== null ? minutesToTimeText(defaultMinutes) : '00:00',
  )
  const mostrarSelector = !allowEmpty || tieneValorPropio

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>

      {allowEmpty && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={tieneValorPropio}
            onChange={(e) => setTieneValorPropio(e.target.checked)}
          />
          Usar un valor propio para esta cancha
        </label>
      )}

      {mostrarSelector && <TimeSelect label={label} value={valor} onChange={setValor} />}
      <input type="hidden" name={name} value={mostrarSelector ? valor : ''} />

      <p className="text-muted-foreground text-xs">{help}</p>
      {error && (
        <p className="text-destructive flex items-center gap-1 text-xs font-medium">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}
