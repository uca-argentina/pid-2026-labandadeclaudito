import { Clock } from 'lucide-react'
import { mesesCortos, nombresDeDias } from '@/lib/labels'
import { diaDeHoy } from '@/lib/time'

// Un mini calendario con el día y el mes, y al lado el día de la semana y la
// hora. El año se muestra solo si no es el actual.
export function FechaDelTurno({
  dia,
  horaInicio,
  horaFin,
}: {
  dia: string
  horaInicio: string
  horaFin: string
}) {
  const [anio, mes, diaDelMes] = dia.split('-')
  // dia es YYYY-MM-DD: leído en UTC no se corre de día por la zona horaria
  const diaDeLaSemana = nombresDeDias[new Date(`${dia}T00:00:00Z`).getUTCDay()]
  const esDeOtroAnio = anio !== diaDeHoy().slice(0, 4)

  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 text-primary flex w-11 shrink-0 flex-col items-center rounded-lg py-1 leading-tight">
        <span className="text-[10px] font-semibold uppercase">{mesesCortos[Number(mes) - 1]}</span>
        <span className="text-lg font-bold">{Number(diaDelMes)}</span>
      </div>
      <div>
        <p className="font-medium">
          {diaDeLaSemana}
          {esDeOtroAnio && <span className="text-muted-foreground font-normal"> · {anio}</span>}
        </p>
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="size-3" />
          {horaInicio} a {horaFin}
        </p>
      </div>
    </div>
  )
}
