import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { minutesToTimeText } from '@/lib/time'

// Campo de "anticipación mínima" que usan los forms de complejo y de cancha.
// Es un input type="time" (HH:MM) igual que la hora de apertura: cada form lo
// lee con FormData y lo pasa a minutos con timeTextToMinutes().
export function MinAdvanceInput({
  name,
  label,
  defaultMinutes,
  help,
  error,
}: {
  name: string
  label: string
  defaultMinutes: number | null
  help: string
  error?: string
}) {
  let valorInicial = ''
  if (defaultMinutes !== null) {
    valorInicial = minutesToTimeText(defaultMinutes)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type="time"
        defaultValue={valorInicial}
        aria-invalid={!!error}
        className={error ? 'border-destructive ring-destructive/20 ring-3' : undefined}
      />
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
