import { nombresDeDias } from '@/lib/labels'

type Demanda = { diaSemana: number; horaInicio: string; reservas: number }

// Lunes primero, domingo al final, como se lee una semana en Argentina
const ordenDeDias = [1, 2, 3, 4, 5, 6, 0]

function reservasEn(demanda: Demanda[], diaSemana: number, horaInicio: string): number {
  for (const celda of demanda) {
    if (celda.diaSemana === diaSemana && celda.horaInicio === horaInicio) {
      return celda.reservas
    }
  }
  return 0
}

function horariosDistintos(demanda: Demanda[]): string[] {
  const horarios: string[] = []
  for (const celda of demanda) {
    if (!horarios.includes(celda.horaInicio)) {
      horarios.push(celda.horaInicio)
    }
  }
  return horarios.sort()
}

function maximoDeReservas(demanda: Demanda[]): number {
  let maximo = 0
  for (const celda of demanda) {
    if (celda.reservas > maximo) {
      maximo = celda.reservas
    }
  }
  return maximo
}

// Cuanto más se reserva un horario respecto del más pedido, más intenso el verde
function claseDeIntensidad(reservas: number, maximo: number): string {
  if (reservas === 0 || maximo === 0) return 'bg-muted text-muted-foreground'

  const proporcion = reservas / maximo
  if (proporcion <= 0.25) return 'bg-primary/15 text-foreground'
  if (proporcion <= 0.5) return 'bg-primary/35 text-foreground'
  if (proporcion <= 0.75) return 'bg-primary/65 text-primary-foreground'
  return 'bg-primary text-primary-foreground'
}

export function DemandHeatmap({ demanda }: { demanda: Demanda[] }) {
  const horarios = horariosDistintos(demanda)
  const maximo = maximoDeReservas(demanda)

  if (maximo === 0) {
    return <p className="text-muted-foreground text-sm">Todavía no hay reservas en este período.</p>
  }

  return (
    <div className="space-y-4">
      {/* En mobile la tabla es más ancha que la pantalla: scrollea adentro de
          la tarjeta para que la página no tenga scroll horizontal */}
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="sr-only">Día</th>
              {horarios.map((horario) => (
                <th key={horario} className="text-muted-foreground px-1 font-medium">
                  {horario}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordenDeDias.map((diaSemana) => (
              <tr key={diaSemana}>
                <th className="text-muted-foreground pr-2 text-left font-medium whitespace-nowrap">
                  {nombresDeDias[diaSemana]}
                </th>
                {horarios.map((horario) => {
                  const reservas = reservasEn(demanda, diaSemana, horario)
                  return (
                    <td
                      key={horario}
                      title={`${nombresDeDias[diaSemana]} ${horario}: ${reservas} reservas`}
                      className={`size-9 min-w-9 rounded-md text-center font-medium ${claseDeIntensidad(reservas, maximo)}`}
                    >
                      {reservas}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        Menos
        <span className="bg-muted size-4 rounded" />
        <span className="bg-primary/15 size-4 rounded" />
        <span className="bg-primary/35 size-4 rounded" />
        <span className="bg-primary/65 size-4 rounded" />
        <span className="bg-primary size-4 rounded" />
        Más
      </div>
    </div>
  )
}
