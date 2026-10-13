// Columnas con cuántos turnos empiezan en cada hora de hoy. Las horas que ya
// empezaron (con la actual, que dice "Ahora") van en gris y las que vienen
// en verde.
export function TurnosPorHora({
  horas,
  horaActual,
}: {
  horas: { hora: number; total: number }[]
  horaActual: number
}) {
  if (horas.length === 0) {
    return <p className="text-muted-foreground text-sm">Hoy no hay turnos reservados.</p>
  }

  let maximo = 0
  for (const columna of horas) {
    if (columna.total > maximo) maximo = columna.total
  }

  return (
    <div>
      <div className="text-muted-foreground mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <h3 className="text-foreground font-semibold">Turnos por hora</h3>
        <div className="flex gap-4">
          <span className="flex items-center gap-2">
            <span className="bg-muted-foreground/30 size-2.5 rounded-full" />
            Ya empezaron
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-primary size-2.5 rounded-full" />
            Por empezar
          </span>
        </div>
      </div>

      <div className="flex gap-1">
        {horas.map((columna) => {
          const yaEmpezo = columna.hora <= horaActual
          const esAhora = columna.hora === horaActual
          const alto = maximo === 0 ? 0 : (columna.total / maximo) * 100

          return (
            <div
              key={columna.hora}
              title={`${columna.hora}:00 a ${columna.hora + 1}:00 · ${columna.total} turnos`}
              className="group flex flex-1 flex-col items-center"
            >
              <div className="border-border flex h-28 w-full items-end justify-center border-b pt-5">
                <div
                  className={`relative w-full max-w-6 rounded-t-[4px] transition-colors ${
                    yaEmpezo
                      ? 'bg-muted-foreground/30 group-hover:bg-muted-foreground/45'
                      : 'bg-primary group-hover:bg-primary/80'
                  }`}
                  style={{ height: `${alto}%` }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold tabular-nums opacity-0 transition-opacity group-hover:opacity-100">
                    {columna.total}
                  </span>
                </div>
              </div>
              {/* En celular no entran todas: se ven las horas pares y la actual */}
              <span
                className={`mt-1.5 text-xs tabular-nums ${esAhora ? 'text-foreground font-bold' : 'text-muted-foreground'} ${columna.hora % 2 === 1 && !esAhora ? 'max-sm:invisible' : ''}`}
              >
                <span className="sm:hidden">{columna.hora}</span>
                <span className="max-sm:hidden">{esAhora ? 'Ahora' : columna.hora}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
