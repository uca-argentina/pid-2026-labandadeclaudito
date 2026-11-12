## Dónde va cada archivo nuevo

| Qué estás escribiendo                  | Dónde va                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| Tabla nueva o campo nuevo              | `prisma/schema.prisma` + `npm run db:migrate`                                      |
| Una regla de negocio reusable          | `lib/<tema>.ts` **+ `lib/<tema>.test.ts`**                                         |
| Schema de validación de un body        | `lib/validations/<recurso>.ts`                                                     |
| Schema de filtros que vienen de la URL | `lib/validations/<pantalla>.ts`, nombre `...FiltersSchema`                         |
| Un endpoint                            | `app/api/<recurso>/route.ts` (los métodos son funciones exportadas en ese archivo) |
| Una pantalla                           | `app/(dashboard)/<rol>/<ruta>/page.tsx`                                            |
| El esqueleto de carga de una sección   | `app/(dashboard)/<rol>/loading.tsx`                                                |
| Un formulario o botón que hace `fetch` | `components/<nombre>.tsx` con `'use client'`                                       |
| Un bloque visual sin interactividad    | `components/<nombre>.tsx` **sin** `'use client'`                                   |
| Traducción de un enum a texto          | `lib/labels.ts`                                                                    |
| Test del endpoint                      | `tests/<tema>.test.ts`                                                             |

Nombres de archivo y de función **en inglés**; las keys que van directo a Prisma
**en español**, matcheando el schema. Ejemplo real: el schema se llama
`createComplexSchema` pero sus campos son `nombre`, `direccion`, `zona`,
`contacto`. Así el objeto va derecho al `create` sin un paso de traducción.

---

## Los grupos de rutas

Los paréntesis **no agregan segmento a la URL**. Solo sirven para que cada grupo
tenga su propio `layout.tsx`.

```
app/
  layout.tsx                  html/body/fuentes/ThemeProvider. Nada más.
  (public)/                   sin login → botón de tema flotante
    page.tsx                  →  /
    estilo/page.tsx           →  /estilo
    (auth)/                   grupo anidado, tampoco agrega segmento
      login/page.tsx          →  /login
      register/page.tsx       →  /register
  (dashboard)/                con sesión → sidebar + bottom-nav
    layout.tsx                auth(), redirect, AppSidebar, el ancho de todo
    perfil/page.tsx           →  /perfil     (los 3 roles)
    jugador/page.tsx          →  /jugador
    jugador/canchas/page.tsx  →  /jugador/canchas
    dueno/...                 →  /dueno/...
    admin/...                 →  /admin/...
```

**Una pantalla nueva del dashboard va en `app/(dashboard)/<rol>/`** y hereda
gratis: la sesión ya verificada, el sidebar, la bottom-nav, y el ancho y el
padding de la página. Por eso **tu `page.tsx` no pone `max-w` ni padding
propio** — eso lo hace el layout:

```tsx
<div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6 pt-7 pb-12 lg:px-10 portrait:pb-28">
  {children}
</div>
```

---
