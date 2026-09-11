@AGENTS.md

# TocaYJuga — guía para Claude Code

Este archivo lo lee Claude Code de los 3 integrantes. Editarlo en equipo cuando
cambie una convención. Si algo acá contradice lo que te pide el usuario en el
chat, gana el usuario — pero avisá que estás yendo contra esta guía.

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

- **Lógica de negocio en `lib/services/`**, no en route handlers ni en componentes.
- **Acceso a la DB solo desde `lib/services/`**, vía `db` (`lib/db.ts`). Nada de
  Prisma suelto en componentes o páginas.
- **Validación**: todo input externo (form, body, params) pasa por un schema Zod
  de `lib/validations/` antes de tocar la DB. El mismo schema valida en client y
  en server.
- **Server Actions** para los formularios. Route handlers (`app/api/.../route.ts`)
  solo si de verdad hace falta un endpoint REST.
- **Server Components por default.** `"use client"` solo cuando hay
  interactividad real (`useState`, `onClick`, calendario).
- Archivos y componentes chicos, una responsabilidad cada uno.

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

- **Prettier decide el formato** — no pelear con él. `npm run format` antes de
  cada commit (el CI lo chequea).
- Nombres del dominio en español (`Cancha`, `Reserva`, `Complejo`, `duenio`).
  Infra técnica en inglés está ok.
- Comentarios: solo el **por qué** no obvio. No comentar lo que el código ya dice.
- Nada de `any`. Si TS se queja, arreglar el tipo, no callarlo.

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
- Backend separado (se extrae `lib/services/` a un server aparte solo si un
  sprint futuro lo justifica — jobs pesados, tiempo real, etc.)
- Emails reales (por ahora se simulan en la DB)

## Documentación del proyecto

- `docs/superpowers/plans/2026-09-09-sprint1-mvp.md` — plan técnico paso a paso
- `docs/backlog-sprint1.md` — tickets del Sprint 1 con criterios de aceptación
