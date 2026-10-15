import { MapPin, Wallet } from 'lucide-react'
import type { Deporte } from '@/lib/generated/prisma/client'
import type { MontoDelHistorial } from '@/lib/historial'
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'

// Celdas de las tablas de reservas (historial y canceladas), compartidas
// entre la pantalla del jugador y la del dueño.

export function CeldaCancha({
  nombre,
  deporte,
  complejo,
}: {
  nombre: string
  deporte: Deporte
  complejo: string
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{nombre}</span>
        <EtiquetaDeporte deporte={deporte} />
      </div>
      <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
        <MapPin className="size-3 shrink-0" />
        {complejo}
      </p>
    </div>
  )
}

const tonos = {
  normal: 'text-primary',
  exito: 'text-green-600',
  peligro: 'text-destructive',
}

// Lo que devuelve montoDelHistorial(): null = no hay nada que mostrar
export function CeldaMonto({ monto }: { monto: MontoDelHistorial | null }) {
  if (!monto) return <span className="text-muted-foreground">—</span>

  return (
    <div>
      <p className={`inline-flex items-center gap-1 font-semibold ${tonos[monto.tono]}`}>
        <Wallet className="size-3.5" />
        {monto.monto}
      </p>
      <p className="text-muted-foreground text-xs">{monto.etiqueta}</p>
    </div>
  )
}
