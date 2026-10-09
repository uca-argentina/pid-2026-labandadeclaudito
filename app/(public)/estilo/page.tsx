import { Button } from '@/components/ui/button'
import { EstadoVacio } from '@/components/estado-vacio'
import { EtiquetaDeporte } from '@/components/etiqueta-deporte'
import { FranjaDeCancha } from '@/components/franja-de-cancha'

const colores = [
  { nombre: 'primary', clase: 'bg-primary text-primary-foreground' },
  { nombre: 'sidebar', clase: 'bg-sidebar text-sidebar-foreground' },
  { nombre: 'clay/12', clase: 'bg-clay/12 text-clay-foreground' },
  { nombre: 'sand', clase: 'bg-sand text-foreground' },
  { nombre: 'highlight', clase: 'bg-highlight text-highlight-foreground' },
  { nombre: 'card', clase: 'bg-card text-card-foreground shadow-card' },
  { nombre: 'secondary', clase: 'bg-secondary text-secondary-foreground' },
  { nombre: 'muted', clase: 'bg-muted text-muted-foreground' },
  { nombre: 'destructive/10', clase: 'bg-destructive/10 text-destructive' },
]

export default function EstiloPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-12 px-6 py-12">
      <div>
        <h1 className="font-heading text-4xl font-bold tracking-tight">Guía de estilo</h1>
        <p className="text-muted-foreground mt-1.5">
          Referencia visual de TocaYJuga. No es una pantalla real de la app.
        </p>
      </div>

      <section className="space-y-3.5">
        <h2 className="font-heading text-xl font-bold">Colores</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {colores.map((color) => (
            <div key={color.nombre} className={`rounded-2xl p-4 ${color.clase}`}>
              <p className="text-sm font-semibold">{color.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3.5">
        <h2 className="font-heading text-xl font-bold">Tipografía</h2>
        <div className="space-y-2.5">
          <p className="font-heading text-4xl font-bold tracking-tight">
            Título h1 — font-heading text-4xl font-bold
          </p>
          <p className="font-heading text-xl font-bold">
            Título h2 — font-heading text-xl font-bold
          </p>
          <p className="font-heading text-primary text-2xl font-bold">$45.000 — precio</p>
          <p className="text-base">Texto de cuerpo — text-base</p>
          <p className="text-muted-foreground text-sm">
            Texto secundario — text-sm text-muted-foreground
          </p>
        </div>
      </section>

      <section className="space-y-3.5">
        <h2 className="font-heading text-xl font-bold">Botones</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Acción principal</Button>
          <Button variant="secondary">Secundaria</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Cancelar reserva</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">sm · 36px</Button>
          <Button>default · 44px</Button>
          <Button size="lg">lg · 48px</Button>
        </div>
      </section>

      <section className="space-y-3.5">
        <h2 className="font-heading text-xl font-bold">Tarjeta</h2>
        <div className="bg-card shadow-card max-w-xs overflow-hidden rounded-2xl">
          <FranjaDeCancha deporte="FUTBOL_5" />
          <div className="p-4">
            <EtiquetaDeporte deporte="FUTBOL_5" />
            <p className="font-heading mt-2 text-lg font-bold">Sábado 10 de octubre</p>
            <p className="text-muted-foreground text-sm">Cancha 1 · Complejo Los Pinos</p>
            <p className="font-heading text-primary mt-3 text-2xl font-bold">$15.000</p>
            <Button className="mt-3 w-full">Ver disponibilidad</Button>
          </div>
        </div>
      </section>

      <section className="space-y-3.5">
        <h2 className="font-heading text-xl font-bold">Estado vacío</h2>
        <EstadoVacio
          titulo="No tenés turnos reservados"
          texto="Elegí un complejo y reservá el horario que te sirva."
        >
          <Button>Buscar canchas</Button>
        </EstadoVacio>
      </section>
    </main>
  )
}
