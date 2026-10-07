import { Ban, UserX, Wallet } from 'lucide-react'
import { formatPrecio } from '@/lib/labels'
import { AnimatedNumber } from '@/components/animated-number'
import { VariationBadge } from '@/components/variation-badge'

const claseTarjeta =
  'border-border bg-card h-full rounded-2xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-md'

function Titulo({ icono: Icono, texto }: { icono: typeof Wallet; texto: string }) {
  return (
    <p className="text-muted-foreground flex items-center gap-2 text-base font-medium whitespace-nowrap">
      <span className="bg-acento/10 text-acento flex size-8 shrink-0 items-center justify-center rounded-lg">
        <Icono className="size-4" />
      </span>
      {texto}
    </p>
  )
}

function BarraComparada({
  etiqueta,
  valor,
  maximo,
  clase,
}: {
  etiqueta: string
  valor: number
  maximo: number
  clase: string
}) {
  const ancho = maximo === 0 ? 0 : (valor / maximo) * 100

  // Etiqueta y monto arriba, la barra abajo a todo el ancho: así entra en
  // tarjetas angostas sin aplastar la barra
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-3 text-sm">
        <span className="text-muted-foreground whitespace-nowrap">{etiqueta}</span>
        <span className="font-medium whitespace-nowrap tabular-nums">{formatPrecio(valor)}</span>
      </div>
      <div className="bg-acento/10 h-2.5 rounded-full">
        <div
          className={`h-full origin-left rounded-full transition-[width] duration-700 ease-out motion-safe:animate-crecer-barra ${clase}`}
          style={{ width: `${ancho}%` }}
        />
      </div>
    </div>
  )
}

// Ingresos del período y, abajo, dos barras: este período contra el anterior
export function IncomeCard({
  ingresos,
  ingresosAnteriores,
  variacion,
}: {
  ingresos: number
  ingresosAnteriores: number
  variacion: number | null
}) {
  const maximo = Math.max(ingresos, ingresosAnteriores)

  return (
    <div className={claseTarjeta}>
      <Titulo icono={Wallet} texto="Ingresos por señas" />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="text-4xl font-semibold tracking-tight whitespace-nowrap">
          <AnimatedNumber valor={ingresos} tipo="precio" />
        </p>
        <VariationBadge variacion={variacion} subirEsBueno={true} />
      </div>
      <div className="mt-5 space-y-3">
        <BarraComparada
          etiqueta="Este período"
          valor={ingresos}
          maximo={maximo}
          clase="bg-acento"
        />
        <BarraComparada
          etiqueta="Anterior"
          valor={ingresosAnteriores}
          maximo={maximo}
          clase="bg-acento/40"
        />
      </div>
    </div>
  )
}

function Baja({
  icono: Icono,
  etiqueta,
  cantidad,
  tasa,
  variacion,
}: {
  icono: typeof Ban
  etiqueta: string
  cantidad: number
  tasa: string
  variacion: number | null
}) {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground flex items-center gap-1.5 text-base whitespace-nowrap">
        <Icono className="size-4 shrink-0" />
        {etiqueta}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-4xl font-semibold tracking-tight">
          <AnimatedNumber valor={cantidad} />
        </p>
        {/* Menos cancelaciones o no-shows es mejor: subir es malo */}
        <VariationBadge variacion={variacion} subirEsBueno={false} />
      </div>
      <p className="text-muted-foreground text-sm whitespace-nowrap">{tasa}</p>
    </div>
  )
}

// Cancelaciones y no-shows juntos: son las dos formas de perder un turno
export function LossesCard({
  cancelaciones,
  tasaCancelaciones,
  variacionCancelaciones,
  noShows,
  tasaNoShows,
  variacionNoShows,
}: {
  cancelaciones: number
  tasaCancelaciones: number
  variacionCancelaciones: number | null
  noShows: number
  tasaNoShows: number
  variacionNoShows: number | null
}) {
  return (
    // @container: las dos columnas dependen del ancho de la tarjeta, no de la
    // pantalla (con el sidebar abierto la tarjeta puede ser angosta)
    <div className={`${claseTarjeta} @container`}>
      <Titulo icono={Ban} texto="Turnos perdidos" />
      <div className="mt-4 grid gap-4 @xs:grid-cols-2">
        <Baja
          icono={Ban}
          etiqueta="Cancelaciones"
          cantidad={cancelaciones}
          tasa={`${tasaCancelaciones}% de las reservas`}
          variacion={variacionCancelaciones}
        />
        <div className="border-border @xs:border-l @xs:pl-4">
          <Baja
            icono={UserX}
            etiqueta="No se presentaron"
            cantidad={noShows}
            tasa={`${tasaNoShows}% de los turnos`}
            variacion={variacionNoShows}
          />
        </div>
      </div>
    </div>
  )
}
