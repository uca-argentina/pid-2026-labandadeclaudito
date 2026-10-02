'use client'

const HORAS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'))
const MINUTOS = Array.from({ length: 60 }, (_, m) => String(m).padStart(2, '0'))

const selectClassName =
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 h-9 w-16 rounded-lg border bg-transparent px-1.5 text-center text-sm outline-none focus-visible:ring-3'

// Reemplaza <input type="time">: ese input nativo muestra 12h con AM/PM o
// 24h según el idioma/región del sistema operativo de quien lo usa, así que
// se veía distinto para cada integrante del equipo. Estos dos <select> de
// hora y minuto se ven siempre igual, para cualquiera.
export function TimeSelect({
  label,
  name,
  value,
  onChange,
  disabled,
  invalid,
}: {
  // Para lectores de pantalla: "Apertura" → "Apertura, hora" / "Apertura, minuto"
  label: string
  name?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  invalid?: boolean
}) {
  const [hora, minuto] = value.split(':')

  let className = selectClassName
  if (invalid) {
    className = selectClassName + ' border-destructive ring-destructive/20 ring-3'
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        aria-label={`${label}, hora`}
        aria-invalid={invalid}
        value={hora}
        disabled={disabled}
        onChange={(e) => onChange(`${e.target.value}:${minuto}`)}
        className={className}
      >
        {HORAS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-muted-foreground">:</span>
      <select
        aria-label={`${label}, minuto`}
        aria-invalid={invalid}
        value={minuto}
        disabled={disabled}
        onChange={(e) => onChange(`${hora}:${e.target.value}`)}
        className={className}
      >
        {MINUTOS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  )
}
