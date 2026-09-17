import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ImageIcon, MapPin, Phone, Plus, Shapes } from 'lucide-react'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Mis complejos | TocaYJuga',
}

export default async function MisComplejosPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.rol !== 'DUENIO') redirect('/jugador')

  const complejosDelDuenio = await db.complejo.findMany({
    where: { duenioId: session.user.id, activo: true },
    orderBy: { createdAt: 'desc' },
    include: { imagenes: { where: { activo: true }, orderBy: { orden: 'asc' }, take: 1 } },
  })

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Mis complejos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Los complejos que cargaste en tu cuenta.
          </p>
        </div>
        <Link href="/dueno/complejos/nuevo" className={buttonVariants()}>
          <Plus /> Crear complejo
        </Link>
      </div>

      {complejosDelDuenio.length === 0 && (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="font-medium">Todavía no cargaste complejos</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Usá el botón “Crear complejo” para agregar el primero.
            </p>
          </CardContent>
        </Card>
      )}

      {complejosDelDuenio.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {complejosDelDuenio.map((complejo) => (
            <Card key={complejo.id} className="gap-0 pt-0">
              {/* Foto y datos abren el detalle; "Ver canchas" queda afuera para no anidar links */}
              <Link
                href={`/dueno/complejos/${complejo.id}`}
                className="hover:bg-accent flex flex-col gap-4 pb-4 transition-colors"
              >
                {complejo.imagenes.length > 0 ? (
                  <div className="relative aspect-video">
                    <Image
                      src={complejo.imagenes[0].url}
                      alt={`Foto de ${complejo.nombre}`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-muted text-muted-foreground flex aspect-video flex-col items-center justify-center gap-1 text-sm">
                    <ImageIcon className="size-5" />
                    Sin fotos
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-semibold">{complejo.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 shrink-0" /> {complejo.direccion} · {complejo.zona}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0" /> {complejo.contacto}
                  </p>
                </CardContent>
              </Link>
              <CardFooter>
                <Link
                  href={`/dueno/complejos/${complejo.id}/canchas`}
                  className={buttonVariants({ variant: 'outline', className: 'w-full' })}
                >
                  <Shapes /> Ver canchas
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
