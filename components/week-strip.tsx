import { Activity, Flame, Moon, TrendingUp } from 'lucide-react'
import { nombresCortosDeDias, nombresDeDias } from '@/lib/labels'
import { nivelDeDemanda } from '@/lib/dashboard'

// Lunes primero, domingo al final, como se lee una semana en Argentina
const ordenDeDias = [1, 2, 3, 4, 5, 6, 0]

const iconoDelNivel = {
  pico: Flame,
  alta: TrendingUp,
  media: Activity,
  baja: Moon,
}

const textoDelNivel = {
  pico: 'El día más fuerte',
  alta: 'Mucha demanda',
  media: 'Demanda media',
  baja: 'Poca demanda',
}

// La semana tipo como un pronóstico del clima: un ícono según qué tan lleno
// estuvo cada día, el total de reservas y una barrita. El día más fuerte se
// destaca con el color del deporte.
// En pantallas chicas la tira scrollea de costado; contain:inline-size hace
// que su ancho mínimo no estire la página.
export function WeekStrip({ totalesPorDia }: { totalesPorDia: number[] }) {
  let maximo = 0
  for (const total of totalesPorDia) {
    if (total > maximo) maximo = total
  }

  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-1 [contain:inline-size]">
      <ul className="grid min-w-[36rem] grid-cols-7 gap-2">
        {ordenDeDias.map((dia) => {
          const total = totalesPorDia[dia]
          const nivel = nivelDeDemanda(total, maximo)
          const Icono = iconoDelNivel[nivel]
          const esPico = nivel === 'pico'
          const ancho = maximo === 0 ? 0 : (total / maximo) * 100

          return (
            <li
              key={dia}
              title={`${nombresDeDias[dia]}: ${total} reservas. ${textoDelNivel[nivel]}`}
              className={
                esPico
                  ? 'bg-acento text-acento-foreground flex flex-col items-center gap-2 rounded-2xl p-3 shadow-md transition-transform hover:-translate-y-1'
                  : 'border-border bg-card flex flex-col items-center gap-2 rounded-2xl border p-3 transition-transform hover:-translate-y-1'
              }
            >
              <span
                className={
                  esPico ? 'text-sm font-medium' : 'text-muted-foreground text-sm font-medium'
                }
              >
                {nombresCortosDeDias[dia]}
              </span>
              <Icono
                className={esPico ? 'size-6 motion-safe:animate-pulse' : 'text-acento size-6'}
              />
              <span className="text-2xl font-semibold tabular-nums">{total}</span>
              <span
                className={
                  esPico
                    ? 'bg-acento-foreground/25 h-1.5 w-full rounded-full'
                    : 'bg-acento/15 h-1.5 w-full rounded-full'
                }
              >
                <span
                  className={
                    esPico
                      ? 'bg-acento-foreground block h-full rounded-full transition-[width] duration-700'
                      : 'bg-acento block h-full rounded-full transition-[width] duration-700'
                  }
                  style={{ width: `${ancho}%` }}
                />
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
