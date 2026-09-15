import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const colores = [
  { nombre: 'primary', clase: 'bg-primary text-primary-foreground' },
  { nombre: 'secondary', clase: 'bg-secondary text-secondary-foreground' },
  { nombre: 'muted', clase: 'bg-muted text-muted-foreground' },
  { nombre: 'accent', clase: 'bg-accent text-accent-foreground' },
  { nombre: 'destructive', clase: 'bg-destructive text-white' },
  { nombre: 'card', clase: 'bg-card text-card-foreground border' },
]

export default function EstiloPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Guía de estilo — TocaYJuga</h1>
        <p className="text-muted-foreground mt-1">
          Referencia visual. No es una pantalla real de la app.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Colores</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {colores.map((color) => (
            <div key={color.nombre} className={`rounded-lg p-4 ${color.clase}`}>
              <p className="text-sm font-medium">{color.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Tipografía</h2>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Título h1 — text-3xl font-semibold</h1>
          <h2 className="text-2xl font-semibold">Título h2 — text-2xl font-semibold</h2>
          <h3 className="text-xl font-semibold">Título h3 — text-xl font-semibold</h3>
          <p className="text-base">Texto de cuerpo — text-base</p>
          <p className="text-muted-foreground text-sm">
            Texto secundario — text-sm text-muted-foreground
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Botones</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Acción principal</Button>
          <Button variant="secondary">Acción secundaria</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Cancelar reserva</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Card de ejemplo</h2>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Cancha Fútbol 5<Badge>Césped sintético</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm">Complejo Los Pinos — Palermo</p>
            <p className="text-lg font-semibold">$15.000 / turno</p>
            <Button className="w-full">Ver disponibilidad</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
