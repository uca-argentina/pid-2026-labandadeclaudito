import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { auth } from '@/auth'
import { diaEnPalabras, saludoSegunHora } from '@/lib/fechas'
import { diaDeHoy } from '@/lib/time'

// ponytail: página mínima para que el layout /admin exista;
// el panel con métricas globales es SCRUM-65
export default async function AdminHomePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const primerNombre = (session.user.name ?? '').split(' ')[0]

  return (
    <div>
      <p className="text-muted-foreground text-sm font-medium">{diaEnPalabras(diaDeHoy())}</p>
      <h1 className="font-heading mt-1 text-4xl font-bold tracking-tight">
        ¡{saludoSegunHora()}, {primerNombre}!
      </h1>
      <p className="text-muted-foreground mt-1.5">
        Desde acá administrás las cuentas de la plataforma.
      </p>

      <div className="bg-clay/12 mt-7 max-w-md rounded-3xl px-7 py-6">
        <p className="font-heading text-xl font-bold">Usuarios</p>
        <p className="text-foreground/80 mt-1.5 text-sm">
          Buscá una cuenta, filtrá por rol y suspendé o reactivá a quien haga falta.
        </p>
        <Link
          href="/admin/usuarios"
          className="text-clay-foreground mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
        >
          Ver usuarios
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
