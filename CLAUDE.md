@AGENTS.md

# TocaYJuga — guía para Claude Code

Este archivo lo lee Claude Code de los 3 integrantes. Editarlo en equipo cuando
cambie una convención. Si algo acá contradice lo que te pide el usuario en el
chat, gana el usuario — pero avisá que estás yendo contra esta guía.

## Cómo responder en el chat

- **Respuestas concisas.** Arrancá con el resultado o la respuesta directa. Nada
  de introducción de relleno ("Voy a...", "Perfecto, entonces...") ni de recap
  final de lo que ya dijiste.
- **Sin redundancia.** No repitas el pedido, el plan ni cada paso que hiciste.
- **Excepción — sí se permite repetir/resumir** cuando ayuda: al cerrar una
  respuesta abarcativa (resumen de conceptos) o cuando los cambios hechos son
  varios (lista de qué se tocó y por qué).

## Qué es

Marketplace de reservas de canchas de fútbol: junta canchas de varios complejos
para buscar, comparar y reservar. Trabajo práctico de la materia PID (UCA).
Equipo de 3. El "cliente" (cátedra) manda requisitos nuevos cada ~2 semanas por
sprint — priorizar decisiones que no encierren.

Pagos e ingresos son **simulados** por consigna.

## Stack (no cambiar sin acordarlo en el equipo)

- **Next.js 16** App Router — frontend y backend en el mismo proyecto
- **TypeScript strict**
- **PostgreSQL + Prisma 7** (driver adapter `@prisma/adapter-pg`)
- **Auth.js (NextAuth)** — roles `JUGADOR` / `DUENIO`
- **Tailwind + shadcn/ui**, **React Hook Form + Zod**
- **react-big-calendar** para disponibilidad
- Deploy en **Vercel**, imágenes en **Vercel Blob** (nunca al filesystem)

## Comandos

| Comando              | Para qué                                       |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                         |
| `npm run build`      | Build de producción                            |
| `npm run lint`       | ESLint                                         |
| `npm run format`     | Prettier (escribe) — correr antes de commitear |
| `npm run typecheck`  | `tsc --noEmit`                                 |
| `npm run db:migrate` | Crear/aplicar migración                        |
| `npm run db:studio`  | GUI de la base                                 |
| `npm run db:dev`     | Postgres local sin Docker (`prisma dev`)       |

## Código simple y entendible (la regla más importante)

**Contexto:** en el parcial de la materia nos van a pedir implementar en vivo,
**sin IA**. Para aprobar tenemos que poder reescribir de memoria cualquier parte
de este proyecto. Si el código es difícil, no lo podemos rendir.

Por eso, siempre:

- **Elegir lo obvio antes que lo clever.** Si hay una forma "de manual" y una
  "avanzada pro", va la de manual. Aunque sea un par de líneas más larga.
- **Nada de abstracciones que la tarea no pidió**: no interfaces con una sola
  implementación, no factories, no genéricos complicados, no metaprogramación,
  no helpers "por si acaso".
- **Pasos explícitos antes que one-liners densos.** Un `for` claro le gana a un
  `.reduce()` encadenado que hay que descifrar. Variables intermedias con nombre
  antes que un chain largo.
- **Código repetido y claro le gana a DRY prematuro.** Tres líneas parecidas
  repetidas está bien; una abstracción que nadie entiende, no.
- **Nombres largos y claros** antes que cortos y ambiguos (`reservasDelJugador`,
  no `rs`).
- **Si una función necesita un comentario para entenderse, reescribila más
  simple** en vez de comentarla.
- **TypeScript simple.** Tipos directos. Nada de conditional types, mapped types
  encadenados ni utility types anidados. Si TS se pone difícil, casi siempre es
  señal de que el código es muy complejo.
- Al terminar una feature, dejá en el PR (en castellano) **qué hace el código
  nuevo y por qué**, para que los otros dos lo entiendan sin leer línea por línea.

**El test mental:** ¿los 3 podríamos reescribir esto en el parcial, de memoria,
sin IA? Si la respuesta es no, simplificar hasta que sea sí.

## Antes de escribir código

- **Next 16 tiene breaking changes** respecto de lo que sabés de memoria. Leer
  `node_modules/next/dist/docs/` para el tema que vas a tocar (lo dice AGENTS.md).
  En particular: `params` y `searchParams` son **async** (se hace `await`).
- **Prisma 7**: nunca `new PrismaClient()` sin argumentos (tira error). Usar
  siempre `db` importado de `@/lib/db`. El cliente generado vive en
  `lib/generated/prisma` (gitignored, se regenera con `npm run db:generate`).
- Antes de diseñar una feature nueva, si tenés la skill `superpowers:brainstorming`,
  usala. Si no, igual arrancá alineando alcance con el equipo antes de codear.

## Reglas de arquitectura

- **Mutaciones (crear/editar/borrar) van por endpoints REST** en
  `app/api/<recurso>/route.ts`. Nada de Server Actions — usamos HTTP puro
  (`fetch` desde el cliente) porque es conocimiento universal y transferible al
  parcial. Ver plantillas abajo.
- **Leer datos**: en un Server Component se puede consultar `db` directo (es
  server, no expone nada). No hace falta un endpoint para mostrar una lista.
- **Validación**: todo body de un endpoint pasa por un schema Zod de
  `lib/validations/` con `safeParse` antes de tocar la DB. El mismo schema valida
  en el formulario (client) y en el endpoint (server).
- **Lógica repetida va a `lib/`**. Si algo se usa en un solo endpoint, la lógica
  vive en el `route.ts`. Si se repite (chequeo de ownership, hash de password,
  cálculo de disponibilidad), va a un archivo en `lib/`.
- **Acceso a la DB solo desde el server** (endpoints, Server Components, `lib/`),
  siempre vía `db` de `@/lib/db`. Nunca Prisma en un componente cliente.
- **Server Components por default.** `"use client"` solo cuando hay
  interactividad real (`useState`, `onClick`, formularios, calendario).
- Archivos y componentes chicos, una responsabilidad cada uno.

## Estructura de carpetas

Regla mental: **el cliente hace `fetch` a `app/api/.../route.ts` → el endpoint
valida con Zod → hace la operación → devuelve JSON.**

```
auth.ts                     raíz. Config de Auth.js: provider, callbacks,
                            y authorize() (verificar email+password en login).
middleware.ts               raíz. Protección de rutas por rol. Corre antes de todo.

app/                        RUTAS (URL) + UI
  layout.tsx                layout raíz (nav según rol)
  page.tsx                  landing /
  (auth)/
    login/page.tsx          /login — formulario (fetch al endpoint de Auth.js)
    registro/page.tsx       /registro — formulario (fetch a /api/usuarios)
  (jugador)/
    canchas/page.tsx        /canchas — búsqueda (Server Component, lee db directo)
    canchas/[id]/page.tsx   detalle + calendario de disponibilidad
    reservas/page.tsx       historial del jugador
  (dueno)/
    complejos/page.tsx      lista + formularios (fetch a /api/complejos)
    complejos/[id]/canchas/ ABM canchas
  admin/
    usuarios/page.tsx       listado / baja de usuarios

  api/                      TODOS los endpoints
    auth/[...nextauth]/route.ts   handler que Auth.js EXIGE
    usuarios/route.ts             POST crear usuario (registro)
    complejos/route.ts            GET listar míos · POST crear
    complejos/[id]/route.ts       GET uno · PATCH editar · DELETE borrar
    complejos/[id]/canchas/route.ts   GET listar · POST crear
    canchas/[id]/route.ts         PATCH · DELETE
    canchas/[id]/disponibilidad/route.ts   GET slots libres de una fecha
    reservas/route.ts             POST reservar · GET mis reservas

lib/
  db.ts                     cliente Prisma (ya existe)
  auth-helpers.ts           getSesion() / requireRol('DUENIO') — usado en casi todo endpoint
  ownership.ts              getComplejoDelDuenio(id, duenioId) — reusado en varios endpoints
  password.ts               hashPassword() / verifyPassword() (argon2)
  disponibilidad.ts         calcular turnos libres de una cancha en una fecha
  validations/              SCHEMAS ZOD. Compartidos entre formulario y endpoint.
    usuario.ts                registroSchema, loginSchema
    complejo.ts
    cancha.ts
    reserva.ts

components/
  ui/                       shadcn (generado, se edita libre)
  <propios>.tsx             componentes nuestros

lib/generated/prisma/       cliente Prisma generado (gitignored, no tocar)
prisma/
  schema.prisma
  migrations/
docs/                       plan y backlog del sprint
```

**Qué va en cada archivo — ejemplo registro:**

| Cosa                                          | Archivo                        |
| --------------------------------------------- | ------------------------------ |
| Formulario (inputs, React Hook Form, `fetch`) | `app/(auth)/registro/page.tsx` |
| Endpoint: valida con Zod, hashea, inserta     | `app/api/usuarios/route.ts`    |
| Hashear el password (reusado)                 | `lib/password.ts`              |
| Schema Zod (form + endpoint)                  | `lib/validations/usuario.ts`   |

Login: el formulario llama a `signIn('credentials', ...)` de Auth.js; la
verificación de email+password vive en `authorize()` dentro de `auth.ts`, que
usa `lib/password.ts`.

## Plantillas REST (copiar esta forma siempre)

**Endpoint** — `app/api/<recurso>/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { miSchema } from '@/lib/validations/...'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()

  const parsed = miSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  // hacer la operación con parsed.data (insertar, editar, etc.)

  return NextResponse.json({ ok: true }, { status: 201 })
}
```

**Cliente** — dentro del componente del formulario:

```ts
const res = await fetch('/api/<recurso>', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos),
})
const json = await res.json()
if (!res.ok) {
  setError(json.error)
  return
}
// éxito: redirigir o refrescar
```

Todos los endpoints tienen esa forma. Todos los formularios tienen esa forma.
Cambia el schema y qué se hace en el medio, nada más.

**Reglas de la estructura:**

- Un endpoint: valida con Zod → chequea sesión/rol/ownership → hace la operación
  → devuelve JSON con status HTTP correcto (200/201/400/401/403/404/409).
- Si un `route.ts` se pone largo (>40 líneas) o repite lógica de otro, esa parte
  va a un archivo en `lib/`.
- Para **mostrar** datos no se hace endpoint: el `page.tsx` (Server Component)
  consulta `db` directo.
- Un archivo por recurso en `app/api/`. Los métodos (`GET`, `POST`, `PATCH`,
  `DELETE`) son funciones exportadas en ese mismo archivo.

## Diseño y estilo visual

Definido una vez acá para que las pantallas de los 3 se vean como una sola app.
**Referencia viva:** `npm run dev` → `/estilo` — muestra colores, tipografía,
botones y un card de ejemplo renderizados de verdad. Si hay dudas de cómo se ve
algo, mirar esa página, no adivinar.

- **Paleta**: base crema tirando a verde (no blanco/negro puro) + verde cancha
  como color de marca (`--background`/`--primary` en `app/globals.css`, ya
  cargados, con su versión para modo oscuro). Se usa con las clases de
  Tailwind (`bg-background`, `bg-primary`, `text-primary-foreground`),
  **nunca** un hex escrito a mano en un componente.
- **Paleta completa** son los tokens que ya trae shadcn: `background`,
  `foreground`, `card`, `secondary`, `muted`, `accent`, `destructive`,
  `border`. Cada uno tiene su clase (`bg-muted`, `text-muted-foreground`, etc.)
  — se usan esas, no grises sueltos tipo `text-gray-500` (además acá
  desentonarían: son neutros, la paleta tiene un tinte cálido/verde).
- **Tipografía**: Geist (ya viene de `create-next-app`, wireado en
  `app/layout.tsx`). Escala de títulos: `h1` = `text-3xl font-semibold`, `h2` =
  `text-2xl font-semibold`, `h3` = `text-xl font-semibold`. Cuerpo = `text-base`.
  Texto secundario (ayuda, metadata) = `text-sm text-muted-foreground`.
- **Radios y espaciado**: los que ya definen shadcn/Tailwind (`--radius`,
  escala de `space-y-*`/`gap-*` de Tailwind). No inventar valores en píxeles
  sueltos.
- **Componentes**: shadcn/ui primero (`npx shadcn add <componente>`) antes de
  escribir un componente de UI a mano. Ya instalados: `button`, `card`, `badge`.
- **Estructura de pantalla tipo**: contenido en un `<main>` con
  `mx-auto max-w-3xl px-4 py-10` (ajustar el ancho según la pantalla — un
  listado puede ser más ancho que un form). Listados de Cancha/Complejo van en
  `Card`. Tablas (admin) con el componente `table` de shadcn cuando se agregue.
- **Botones**: uno solo `default` (verde, acción principal) por pantalla.
  `outline`/`secondary` para acciones secundarias. `destructive` solo para
  cancelar/borrar con consecuencia real (cancelar reserva, borrar cancha).
- **Modo claro/oscuro**: andando con `next-themes`. `ThemeProvider` envuelve
  todo en `app/layout.tsx` (`attribute="class"`, sigue el tema del sistema por
  default). El botón está en `components/theme-toggle.tsx` — cambia con clases
  `dark:` de Tailwind, no con JS condicional, para no pelear con SSR.
- **Header**: `components/site-header.tsx` — logo + toggle de tema, sticky
  arriba de todo. Ahí van los links de navegación a medida que existan páginas
  reales (por ahora no hay ninguna: login/registro/búsqueda llegan en Fase 1+).

## Seguridad (no negociable)

- Passwords con **argon2**. Nunca en texto plano, nunca en logs.
- `duenioId` / `jugadorId` **siempre** salen de la sesión (`auth()`), nunca del
  form, del body ni de la URL.
- **Chequeo de ownership**: antes de leer/editar/borrar un recurso, verificar
  server-side que pertenece al usuario logueado. No alcanza con esconder el botón
  en la UI ni con el middleware (el middleware solo filtra por path, no sabe de
  quién es cada complejo).
- `.env` nunca se commitea. Si agregás una variable, va también a `.env.example`
  con valor vacío.
- Usar el **OWASP Top 10** como checklist a medida que avanzamos.

## Convenciones de código

- Antes que nada, la sección **"Código simple y entendible"** de arriba.
- **Prettier decide el formato** — no pelear con él. `npm run format` antes de
  cada commit (el CI lo chequea).
- Nombres del dominio en español (`Cancha`, `Reserva`, `Complejo`, `duenio`).
  Infra técnica en inglés está ok.
- Comentarios: solo el **por qué** no obvio. No comentar lo que el código ya dice.
  Si hace falta comentar el **qué**, el código es muy complejo → simplificar.
- Nada de `any`. Si TS se queja, arreglar el tipo con algo simple, no callarlo
  ni meter un tipo enrevesado.

## Git y PRs

- Una rama por ticket: `feature/UCA-XX-slug` (la key linkea el PR a Jira cuando
  esté conectado).
- Commits estilo Conventional (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`),
  mensaje en español e imperativo.
- **Todo va por PR con review de otro integrante.** Nadie mergea su propio PR sin
  que otro lo mire — es requisito de la materia que los 3 entiendan todo el código.
- `main` = lo que se muestra en la demo. `develop` = integración. Sin push directo
  a `main`.

## Tests

- La lógica no trivial deja al menos un test: cálculo de disponibilidad,
  detección de doble reserva, validaciones que tocan plata o permisos.
- No hace falta framework pesado ni un test por función. Un test por caso crítico.

## Fuera de alcance (no implementar hasta que un sprint lo pida)

- Mapas / geocoding
- Modelo y flujo de **Pago** (está en el DER, no en Sprint 1)
- Backend separado (nuestros `app/api/` + `lib/` ya son el backend; se movería a
  un server aparte solo si un
  sprint futuro lo justifica — jobs pesados, tiempo real, etc.)
- Emails reales (por ahora se simulan en la DB)

## Documentación del proyecto

- `docs/superpowers/plans/2026-09-09-sprint1-mvp.md` — plan técnico paso a paso
- `docs/backlog-sprint1.md` — tickets del Sprint 1 con criterios de aceptación
