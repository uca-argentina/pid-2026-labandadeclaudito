import { sumarDias } from '@/lib/time'
import { nombresDeDias } from '@/lib/labels'

// Columnas con las reservas de cada día: la semana anterior en gris y la
// última en verde, separadas, para comparar las dos de un vistazo.
// totales trae 14 números (7 de la semana anterior y 7 de la última) y desde
// es el primer día (YYYY-MM-DD).
export function ReservasPorDia({ totales, desde }: { totales: number[]; desde: string }) {
  let maximo = 0
  for (const total of totales) {
    if (total > maximo) maximo = total
  }

  const columnas = []
  for (let i = 0; i < totales.length; i++) {
    const dia = sumarDias(desde, i)
    const diaDeLaSemana = nombresDeDias[new Date(`${dia}T00:00:00Z`).getUTCDay()]
    columnas.push({
      dia,
      diaDeLaSemana,
      numero: Number(dia.slice(8, 10)),
      total: totales[i],
      alto: maximo === 0 ? 0 : (totales[i] / maximo) * 100,
      esUltimaSemana: i >= 7,
      esHoy: i === totales.length - 1,
    })
  }

  const semanaAnterior = columnas.slice(0, 7)
  const ultimaSemana = columnas.slice(7)

  return (
    <div>
      <div className="text-muted-foreground mb-3 flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center gap-2">
          <span className="bg-muted-foreground/30 size-2.5 rounded-full" />7 días anteriores
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-primary size-2.5 rounded-full" />
          Últimos 7 días
        </span>
      </div>

      <div className="flex gap-3 sm:gap-5">
        {[semanaAnterior, ultimaSemana].map((semana, numeroDeSemana) => (
          <div key={numeroDeSemana} className="flex flex-1 gap-1 sm:gap-1.5">
            {semana.map((columna) => (
              <div
                key={columna.dia}
                title={`${columna.diaDeLaSemana} ${columna.numero}: ${columna.total} reservas`}
                className="group flex flex-1 flex-col items-center"
              >
                <div className="border-border flex h-36 w-full items-end pt-5 justify-center border-b">
                  <div
                    className={`relative w-full max-w-7 rounded-t-[4px] transition-colors ${
                      columna.esUltimaSemana
                        ? 'bg-primary group-hover:bg-primary/80'
                        : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/45'
                    }`}
                    style={{ height: `${columna.alto}%` }}
                  >
                    {/* El número aparece arriba de la columna al pasar el mouse */}
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold tabular-nums opacity-0 transition-opacity group-hover:opacity-100">
                      {columna.total}
                    </span>
                  </div>
                </div>
                <span
                  className={`mt-1.5 text-xs ${columna.esHoy ? 'text-foreground font-bold' : 'text-muted-foreground'}`}
                >
                  {columna.esHoy ? 'Hoy' : columna.diaDeLaSemana[0]}
                </span>
                <span className="text-muted-foreground text-xs tabular-nums">{columna.numero}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
