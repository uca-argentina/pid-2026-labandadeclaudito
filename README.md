# TocaYJuga

Marketplace de reservas de canchas de fútbol. Junta canchas de distintos complejos en un solo lugar para buscar, comparar y reservar.

Proyecto de la materia PID — UCA.

## Stack

- Next.js 16 (App Router) — frontend + backend en el mismo proyecto
- TypeScript strict
- PostgreSQL + Prisma 7 (driver adapter `@prisma/adapter-pg`)
- Auth.js (NextAuth) — roles Jugador / Dueño
- Tailwind + shadcn/ui
- Vercel Blob para imágenes

## Setup

Requisitos: Node 22+.

```bash
npm install
cp .env.example .env          # completar DATABASE_URL y AUTH_SECRET (npx auth secret)
npm run db:migrate            # aplica migraciones a la DB
npm run dev                   # http://localhost:3000
```

Para `DATABASE_URL` usá cualquier Postgres: `npx create-db` (Prisma Postgres gratis),
`npm run db:dev` (local, sin Docker, necesita internet), o un string de Neon/Supabase.

## Sin internet (parcial)

Todo anda sin conexión: base Postgres local, fuentes e imágenes del seed dentro del
proyecto y fotos subidas guardadas en `public/uploads`.

```bash
# UNA VEZ, con internet
brew install postgresql@15 && brew services start postgresql@15
npm ci                        # deja los paquetes en node_modules (y en la caché de npm)

# Sin internet
npm run setup:local           # crea la base "tocayjuga", el .env, las tablas y los datos de prueba
npm run dev                   # http://localhost:3000
```

- Si ya tenés un `.env` que apunta a otra base, el script se niega a seguir (el seed borra todo).
- `npm run db:migrate` (con un modelo nuevo en `schema.prisma`) también anda sin internet; después `npm run db:generate`.
- Usuarios del seed: `admin@demo.com` / `Admin1234` (dueño) y `jugador@demo.com` / `Jugador1234`.
- No uses `npm run db:dev` (`prisma dev`): se cuelga sin internet.

## Scripts

| Comando                    | Qué hace                                       |
| -------------------------- | ---------------------------------------------- |
| `npm run dev`              | Servidor de desarrollo                         |
| `npm run build`            | Build de producción                            |
| `npm run lint`             | ESLint                                         |
| `npm run format`           | Prettier (escribe)                             |
| `npm run typecheck`        | `tsc --noEmit`                                 |
| `npm run db:dev`           | Postgres local sin Docker (`prisma dev`)       |
| `npm run db:migrate`       | Crear/aplicar migración                        |
| `npm run db:studio`        | GUI de la base (Prisma Studio)                 |
| `npm run test`             | Corre los tests de lib/                        |
| `npm run test:integration` | Corre los tests de tests/ escribiendo en la DB |

## Convenciones

- Ramas: `main` (demo) · `develop` (integración) · `feature/UCA-XX-slug`
- La key del ticket en el nombre de rama linkea el PR a Jira
- Todo PR con review de otro integrante antes de mergear
- Lógica de negocio en `lib/services/`, validación en `lib/validations/`, acceso a DB solo vía `lib/db.ts`

## Documentación

- Plan de implementación Sprint 1: `docs/superpowers/plans/2026-09-09-sprint1-mvp.md`
- Backlog: `docs/backlog-sprint1.md`
