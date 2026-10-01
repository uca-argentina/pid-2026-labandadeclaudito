'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { TimeSelect } from '@/components/time-select'
import { minutesToTimeText } from '@/lib/time'

// Campo de "anticipación mínima" que usan los forms de complejo y de cancha.
// allowEmpty: la cancha puede dejarlo vacío para heredar el valor del
// complejo (minAdvanceMinutes queda null); el complejo no tiene de quién
// heredar, así que ahí allowEmpty queda en false (siempre manda un valor).
export function MinAdvanceInput({
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

      {mostrarSelector && <TimeSelect value={valor} onChange={setValor} />}
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
