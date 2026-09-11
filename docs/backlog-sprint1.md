# Backlog Sprint 1 — TocaYJuga (Marketplace de Reservas de Canchas)

Formato pensado para cargar en Jira. Convención de rama por ticket: `feature/UCA-XX-slug`.
Estimación en story points (Fibonacci). Capacidad estimada equipo (3 personas / 2 semanas): ~35-40 pts.

Plan técnico de referencia: `docs/superpowers/plans/2026-09-09-sprint1-mvp.md`

---

## EPIC UCA-1 — Setup e infraestructura

> Dejar el proyecto listo para que los 3 puedan levantarlo y deployar.

### UCA-2 — Inicializar proyecto Next.js + TypeScript strict

**Tipo:** Task · **Puntos:** 2 · **Depende de:** —

Crear proyecto con `create-next-app` (App Router, Tailwind, ESLint). Agregar Prettier + `eslint-config-prettier`. Confirmar `tsconfig` en `strict: true`.

**Criterios de aceptación:**

- `npm run dev` levanta la app en `localhost:3000`
- `npm run lint` corre sin errores
- `tsconfig.json` tiene `"strict": true`
- `.prettierrc` commiteado, formato consistente al guardar

---

### UCA-3 — Postgres local con Docker

**Tipo:** Task · **Puntos:** 1 · **Depende de:** —

`docker-compose.yml` con Postgres 16. `.env.example` con `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN`. Agregar `.env` a `.gitignore`.

**Criterios de aceptación:**

- `docker compose up -d` levanta la DB
- `.env` NO aparece en `git status`
- README con el comando para levantar la DB

---

### UCA-4 — Schema Prisma inicial + primera migración

**Tipo:** Task · **Puntos:** 3 · **Depende de:** UCA-2, UCA-3

Modelar en `schema.prisma`: `Usuario` (con `rol` enum), `Complejo`, `ImagenComplejo`, `Cancha`, `Reserva`. Enums: `Rol`, `Deporte`, `TipoSuperficie`, `EstadoReserva`. Constraint `@@unique([canchaId, fecha, horaInicio])` en `Reserva`.

**Criterios de aceptación:**

- `npx prisma migrate dev --name init` corre sin error
- `npx prisma studio` muestra las 5 tablas
- El schema refleja el DER (sin tablas Jugador/Dueño separadas — un `Usuario` con `rol`)
- `Pago` queda fuera de este sprint (documentado en el plan)

---

### UCA-5 — Cliente Prisma singleton + carpeta de servicios

**Tipo:** Task · **Puntos:** 1 · **Depende de:** UCA-4

`lib/db.ts` con patrón singleton. Crear `lib/services/` y `lib/validations/`.

**Criterios de aceptación:**

- `lib/db.ts` exporta `db` reutilizable
- No se crean múltiples `PrismaClient` en dev con hot-reload

---

### UCA-6 — Conectar repo a Vercel + preview deploys

**Tipo:** Task · **Puntos:** 2 · **Depende de:** UCA-2

Linkear repo a Vercel. DB real (Neon o Supabase) para el entorno de Vercel. Cargar env vars. Confirmar preview por PR.

**Criterios de aceptación:**

- Push a `main` deploya a producción sin error
- Un PR genera una preview URL funcional
- `DATABASE_URL` y `AUTH_SECRET` cargadas en Vercel (no en el repo)

---

### UCA-7 — Configurar Jira ↔ GitHub + ESLint/Prettier en CI

**Tipo:** Task · **Puntos:** 2 · **Depende de:** UCA-2

Conectar Jira con GitHub. GitHub Action que corre `lint` + `tsc --noEmit` en cada PR. Branch protection en `main` (requiere PR + 1 review).

**Criterios de aceptación:**

- Nombrar rama `feature/UCA-XX-...` linkea el commit al ticket en Jira
- PR con lint roto no se puede mergear
- `main` no acepta push directo

---

## EPIC UCA-8 — Autenticación y roles

> Registro, login, sesión con rol, protección de rutas.

### UCA-9 — Registro de usuario con selección de rol

**Tipo:** Story · **Puntos:** 3 · **Depende de:** UCA-5

Como visitante quiero registrarme eligiendo si soy Jugador o Dueño, para acceder a la plataforma con el rol correcto.

Incluye: `registroSchema` (Zod), `crearUsuario` (service, hash argon2), Server Action, form con React Hook Form.

**Criterios de aceptación:**

- Form valida email, password (min 8), DNI, rol — client y server
- Password se guarda hasheado (argon2), nunca en texto plano
- Email o DNI duplicado devuelve error claro, no rompe
- Se crea la fila en `Usuario` con el `rol` elegido

---

### UCA-10 — Login con Auth.js (Credentials)

**Tipo:** Story · **Puntos:** 3 · **Depende de:** UCA-9

Como usuario registrado quiero iniciar sesión con email y password.

Incluye: config `auth.ts` (Credentials provider, `authorize` con `argon2.verify`), route handler `[...nextauth]`, form de login, tipos de sesión extendidos (`session.user.rol`).

**Criterios de aceptación:**

- Login correcto crea sesión persistente (cookie httpOnly)
- Password incorrecto no revela si el email existe
- `session.user.rol` disponible en Server Components sin query extra a DB
- Botón de logout funcional

---

### UCA-11 — Middleware de protección de rutas por rol

**Tipo:** Story · **Puntos:** 2 · **Depende de:** UCA-10

Como plataforma quiero que un Jugador no pueda entrar a rutas de Dueño y viceversa.

**Criterios de aceptación:**

- Sin sesión + ruta protegida → redirect a `/login`
- Jugador entrando a `/dueno/*` → redirect a `/`
- Dueño entrando a `/jugador/*` → redirect a `/`
- Rutas públicas (`/`, `/login`, `/registro`, búsqueda) siguen accesibles sin login

---

### UCA-12 — ABM de usuarios (perfil + admin básico)

**Tipo:** Story · **Puntos:** 3 · **Depende de:** UCA-10

Como usuario quiero ver y editar mis datos. Como plataforma quiero poder listar/dar de baja usuarios.

**Criterios de aceptación:**

- Usuario logueado ve y edita nombre, teléfono (no email/rol)
- Cambio de password pide password actual
- Vista de listado de usuarios (protegida) con acción de baja lógica
- Baja lógica: el usuario no puede loguear pero sus datos quedan

---

## EPIC UCA-13 — ABM Complejos (rol Dueño)

### UCA-14 — Crear complejo

**Tipo:** Story · **Puntos:** 3 · **Depende de:** UCA-11

Como Dueño quiero registrar mi complejo con nombre, dirección, zona y contacto.

Incluye: `complejoSchema`, `crearComplejo` (service, `duenioId` desde `auth()`), Server Action, form.

**Criterios de aceptación:**

- `duenioId` sale de la sesión, nunca del form
- Validación Zod client + server
- El complejo aparece en "Mis complejos" del dueño que lo creó
- Un Jugador no puede llegar a esta pantalla (UCA-11)

---

### UCA-15 — Listar / editar / borrar complejos propios

**Tipo:** Story · **Puntos:** 3 · **Depende de:** UCA-14

Como Dueño quiero ver mis complejos y modificarlos o eliminarlos.

**Criterios de aceptación:**

- Lista muestra solo los complejos del dueño logueado
- Editar y borrar revalidan ownership server-side antes de escribir
- Dueño A manipulando el `id` en la URL para editar complejo de Dueño B → 403, no modifica nada
- Borrar complejo con canchas pide confirmación

---

### UCA-16 — Subir imágenes de complejo (Vercel Blob)

**Tipo:** Story · **Puntos:** 3 · **Depende de:** UCA-14

Como Dueño quiero subir fotos de mi complejo.

**Criterios de aceptación:**

- Upload va a Vercel Blob, no al filesystem
- Se guarda la URL en `ImagenComplejo` asociada al complejo
- Solo el dueño del complejo puede subir/borrar sus imágenes
- Validación de tipo (jpg/png/webp) y tamaño máximo

---

## EPIC UCA-17 — ABM Canchas (rol Dueño)

### UCA-18 — Crear cancha dentro de un complejo

**Tipo:** Story · **Puntos:** 3 · **Depende de:** UCA-14

Como Dueño quiero agregar canchas a mi complejo con deporte, superficie, capacidad, precio base y horario de atención.

Incluye: `canchaSchema`, service `crearCancha`, form con selects de enums.

**Criterios de aceptación:**

- La cancha se crea solo si el complejo padre es del dueño logueado
- `precioBase` se guarda como Decimal correcto (sin errores de redondeo)
- `horaApertura` / `horaCierre` validados con formato `HH:MM`
- Campos: deporte, tipoSuperficie, capacidad, precioBase, horaApertura, horaCierre, duracionTurnoMin

---

### UCA-19 — Editar / borrar canchas

**Tipo:** Story · **Puntos:** 2 · **Depende de:** UCA-18

**Criterios de aceptación:**

- Editar y borrar revalidan que la cancha pertenece a un complejo del dueño
- Borrar cancha con reservas futuras avisa antes de confirmar
- Cambios de horario no rompen reservas ya existentes

---

## EPIC UCA-20 — Disponibilidad y Reserva (rol Jugador)

### UCA-21 — Servicio de cálculo de disponibilidad

**Tipo:** Story · **Puntos:** 5 · **Depende de:** UCA-18

Como plataforma quiero calcular los turnos libres de una cancha en una fecha, a partir del horario de atención menos las reservas existentes.

Incluye: `generarSlots`, `obtenerSlotsDisponibles(canchaId, fecha)`.

**Criterios de aceptación:**

- Genera slots desde apertura a cierre en bloques de `duracionTurnoMin`
- Marca `disponible: false` los slots con reserva no cancelada
- **Test obligatorio:** cancha 08:00-10:00, turno 60min, reserva a las 09:00 → devuelve `[08:00 disponible, 09:00 ocupado]`
- Reservas canceladas no bloquean el slot

---

### UCA-22 — Búsqueda de canchas por zona y deporte

**Tipo:** Story · **Puntos:** 3 · **Depende de:** UCA-18

Como Jugador quiero buscar canchas filtrando por zona y deporte.

**Criterios de aceptación:**

- Filtros en query params (compartible por URL)
- Resultado muestra nombre de complejo, zona, deporte, superficie, precio base, foto
- Sin filtros → lista todas las canchas publicadas
- Sin resultados → mensaje claro, no pantalla vacía

---

### UCA-23 — Vista de detalle de cancha con calendario de disponibilidad

**Tipo:** Story · **Puntos:** 5 · **Depende de:** UCA-21, UCA-22

Como Jugador quiero ver el calendario de una cancha y qué turnos están libres.

Incluye: `react-big-calendar`, consumo de `obtenerSlotsDisponibles`, selección de fecha.

**Criterios de aceptación:**

- Calendario muestra slots libres/ocupados de la fecha elegida
- Cambiar de día recalcula disponibilidad
- Slots pasados (hora ya transcurrida hoy) no son seleccionables
- Responsive en móvil (requisito del PM)

---

### UCA-24 — Reservar un turno con control de doble reserva

**Tipo:** Story · **Puntos:** 5 · **Depende de:** UCA-23

Como Jugador quiero reservar un turno libre y recibir confirmación.

Incluye: Server Action `reservarTurno`, manejo del error `P2002` del constraint único.

**Criterios de aceptación:**

- Click en slot libre crea la `Reserva` con `estado: CONFIRMADA` y `jugadorId` de la sesión
- **Test de concurrencia:** dos requests al mismo slot casi simultáneas → solo una reserva se crea, la otra recibe "ese horario ya fue reservado"
- El slot pasa a ocupado en el calendario sin recargar
- Solo un Jugador puede reservar (Dueño no)

---

### UCA-25 — Historial de reservas del jugador

**Tipo:** Story · **Puntos:** 2 · **Depende de:** UCA-24

Como Jugador quiero ver mis reservas pasadas y futuras.

**Criterios de aceptación:**

- Lista separada en "Próximas" y "Pasadas" por fecha
- Muestra cancha, complejo, fecha, hora, estado
- Solo las reservas del jugador logueado

---

### UCA-26 — Reservas confirmadas del dueño

**Tipo:** Story · **Puntos:** 2 · **Depende de:** UCA-24

Como Dueño quiero ver las reservas de mis canchas.

**Criterios de aceptación:**

- Lista las reservas de todas las canchas de los complejos del dueño
- Filtro por cancha y por fecha
- Muestra nombre y contacto del jugador que reservó

---

## EPIC UCA-27 — Identidad de la app

### UCA-28 — Aplicar nombre (TocaYJuga) + landing mínima

**Tipo:** Task · **Puntos:** 2 · **Depende de:** —

Nombre ya decidido: **TocaYJuga**. Aplicarlo en layout, `<title>`, favicon. Landing pública `/` con nombre, propuesta de valor y CTA a registro/búsqueda.

**Criterios de aceptación:**

- "TocaYJuga" en layout, título de página y favicon
- Landing responsive con acceso a "Buscar canchas" y "Registrarme"

---

## Resumen de estimación

| Epic                            | Puntos |
| ------------------------------- | ------ |
| UCA-1 Setup e infra             | 13     |
| UCA-8 Auth y roles              | 11     |
| UCA-13 ABM Complejos            | 9      |
| UCA-17 ABM Canchas              | 5      |
| UCA-20 Disponibilidad y Reserva | 22     |
| UCA-27 Identidad                | 2      |
| **Total**                       | **62** |

62 pts supera la capacidad estimada (~38). Opciones si no entra todo:

- Mover a Sprint 2: UCA-12 (ABM usuarios admin, -3), UCA-26 (reservas dueño, -2), UCA-16 (imágenes, -3)
- Simplificar UCA-23 (calendario) a una lista de horarios en vez de `react-big-calendar` (-2)
- El core no negociable del sprint: UCA-2..7, UCA-9..11, UCA-14, UCA-18, UCA-21, UCA-24 (~33 pts)
