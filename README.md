# TocaYJuga

Marketplace de reservas de canchas de fútbol. Junta canchas de distintos complejos en un solo lugar para buscar, comparar y reservar.

Proyecto de la materia PID — UCA.

## Stack

- Next.js 16 (App Router) — frontend + backend en el mismo proyecto
- TypeScript strict
- PostgreSQL + Prisma 7 (driver adapter `@prisma/adapter-pg`)
- Auth.js (NextAuth) — roles Jugador / Dueño
- Tailwind + shadcn/ui
- Docker para Postgres local · Vercel Blob para imágenes

## Setup

Requisitos: Node 22+, Docker.

```bash
npm install
cp .env.example .env          # completar AUTH_SECRET: npx auth secret
npm run db:up                 # levanta Postgres en Docker
npm run db:migrate            # aplica migraciones
npm run dev                   # http://localhost:3000
```

## Scripts

| Comando                     | Qué hace                       |
| --------------------------- | ------------------------------ |
| `npm run dev`               | Servidor de desarrollo         |
| `npm run build`             | Build de producción            |
| `npm run lint`              | ESLint                         |
| `npm run format`            | Prettier (escribe)             |
| `npm run typecheck`         | `tsc --noEmit`                 |
| `npm run db:up` / `db:down` | Postgres local (Docker)        |
| `npm run db:migrate`        | Crear/aplicar migración        |
| `npm run db:studio`         | GUI de la base (Prisma Studio) |

## Convenciones

- Ramas: `main` (demo) · `develop` (integración) · `feature/UCA-XX-slug`
- La key del ticket en el nombre de rama linkea el PR a Jira
- Todo PR con review de otro integrante antes de mergear
- Lógica de negocio en `lib/services/`, validación en `lib/validations/`, acceso a DB solo vía `lib/db.ts`

## Documentación

- Plan de implementación Sprint 1: `docs/superpowers/plans/2026-09-09-sprint1-mvp.md`
- Backlog: `docs/backlog-sprint1.md`
