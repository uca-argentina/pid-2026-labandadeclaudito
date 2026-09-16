# Contexto de rama — feature/abm_complejos

Notas de sesión para no cargar CLAUDE.md. Responsable: Patricio.

## Alcance

ABM de Complejos (UCA-13 / UCA-14 alta). Por ahora solo **Alta**.
Otros integrantes: ABM Usuarios y ABM Canchas.

## Decisiones

- Ruta de alta: `app/(dashboard)/dueno/complejos/nuevo/page.tsx` → URL
  `/dueno/complejos/nuevo`. La protege `proxy.ts` (sin sesión → /login, JUGADOR →
  /jugador) y usa el sidebar del layout `(dashboard)`. Antes estaba en
  `app/(dueno)/...` (URL `/complejos/nuevo`), fuera del proxy: se movió al mergear auth.
- `/dueno/complejos` queda para "Mis complejos" (listado). **Todavía no existe**:
  "Cancelar" / "Ver mis complejos" / "Volver" dan 404 hasta que se haga.
- Link "Crear complejo" en el sidebar (`navPorRol.DUENIO` de
  `components/app-sidebar.tsx`), ya no en `site-header.tsx` (header público).
- Endpoint: `app/api/complexes/route.ts` (recursos de API en inglés, CLAUDE.md).
  Páginas y schema Prisma siguen en español.
- `docs/superpowers/plans/2026-09-09-sprint1-mvp.md` Task 2.1 usa Server Actions:
  desactualizado. Manda CLAUDE.md: REST.

## Flujo de diseño con Claude Design

Canvas: https://claude.ai/code/artifact/967bf1cf-d45a-4eed-b0c7-9da88ba1accf

- Artboard `/complejos/nuevo`: pantalla actual (header + placeholder).
- Artboard "Piezas para acomodar": título, card, inputs (nombre, dirección, zona,
  teléfono), zona de fotos + miniaturas, botones. Copiados de los shadcn del repo
  (colores de `globals.css`, radios 10/14px, alturas 32px).
- Patricio copia/pega piezas al artboard principal, acomoda y guarda.
- Siguiente paso: Claude lee el canvas guardado y lo traduce a `page.tsx` con
  componentes shadcn (`Card`, `Input`, `Label`, `Button`).

## Estado

- [x] Fase 1: ruta + link en header + texto centrado + canvas base.
- [~] Fase 2: diseño del canvas (`ABM Complejos.dc.html`) → código.
  - [x] `app/(dashboard)/dueno/complejos/nuevo/page.tsx` + `components/form-nuevo-complejo.tsx`
        (RHF + Zod, card de fotos solo visual).
  - [x] `lib/validations/complex.ts` (`createComplexSchema`, antes `complejo.ts` /
        `complejoSchema` — renombrado a inglés por CLAUDE.md; keys siguen en español).
  - [x] Link solo para DUENIO (sidebar) + ruta protegida por proxy.
  - [x] `app/api/complexes/route.ts` (POST): 401 sin sesión, 403 si no es DUENIO,
        400 body inválido, 201 inserta con `duenioId` de `auth()`. Form hace el fetch.
- [ ] Siguiente: `/dueno/complejos` (listado "Mis complejos").
- [ ] Fase 3: imágenes (Vercel Blob, UCA-16).

## Pendiente ajeno a la rama

- `npm run typecheck` falla: falta `next-themes` en `node_modules`
  (`npm install` debería resolverlo; está en el código del header/tema).
