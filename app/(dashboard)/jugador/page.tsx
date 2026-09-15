import { auth } from '@/auth'

export default async function JugadorHomePage() {
  const session = await auth()

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Hola, {session?.user?.name}</h1>
        <p className="text-muted-foreground mt-1">Zona de jugador.</p>
      </div>
    </div>
  )
}
