# TocaYJuga — hoja de ayuda del codebase

## 1. Entidades y relaciones

```
                    Usuario (rol: JUGADOR | DUENIO | ADMIN)
          dueño de │                    │ reservó (jugadorId)      │ se sumó
                   ▼                    ▼                           ▼
 Complejo ──1:N──▶ Cancha ──1:N──▶ Reserva ◀──N:1── ParticipanteReserva
   │                 │  │            │ │ │ │ │
   │ 1:N             │  │ 1:N        │ │ │ │ └─1:N─ EtiquetaReserva (amigos etiquetados)
   ▼                 │  ▼            │ │ │ └───1:N─ Calificacion (estrellas al complejo)
 ImagenComplejo      │ PrecioEspecial│ │ └─────1:1─ Disputa ──1:N── EvidenciaDisputa
                     ▼               │ └───────1:1─ Pago (la seña)
                   Block             │
              (franja bloqueada)     └ fecha, horaInicio, horaFin, estado, asistio, precioTurno, jugadores
```

| Entidad                        | Qué es                                                                     | Campos clave                                                                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Usuario`                      | Cualquier cuenta (una sola tabla para los 3 roles)                         | `rol`, `activo`, `email` único                                                                                                                                 |
| `Complejo`                     | El lugar ("Salguero Fútbol")                                               | `duenioId`, `porcentajeSenaDefault`, `minAdvanceMinutesDefault`, `cancellationHours`, `estadoAprobacion`, `activo`                                             |
| `Cancha`                       | Una cancha del complejo                                                    | `complejoId`, `deporte`, `capacidad`, `precioBase`, `horaApertura`, `horaCierre`, `duracionTurnoMin`, `porcentajeSena?`, `minAdvanceMinutes?`, `activo`        |
| `Reserva`                      | Un jugador ocupa una cancha un día de tal a tal hora                       | `canchaId`, `jugadorId`, `fecha` (`@db.Date`), `horaInicio`, `horaFin`, `estado`, `asistio?`, `asistenciaMarcadaEn?`, `precioTurno`, `descuento`, `jugadores?` |
| `ParticipanteReserva`          | Otro jugador que **se sumó** a la reserva                                  | `reservaId`, `jugadorId`, `jugadores` (cuántos aportó). `@@unique([reservaId, jugadorId])`                                                                     |
| `Pago`                         | La seña de una reserva (1:1)                                               | `reservaId` único, `monto`, `porcentaje`, `devuelto`                                                                                                           |
| `Block`                        | El dueño cierra la cancha en un rango de días y horas                      | `courtId`, `startDate`–`endDate`, `startTime`–`endTime`, `reason?`                                                                                             |
| `PrecioEspecial`               | Otro precio para un día de la semana y/o franja                            | `canchaId`, `diaSemana?`, `horaInicio?`–`horaFin?`, `precio`                                                                                                   |
| `Calificacion`                 | 1 a 5 estrellas al complejo después de jugar                               | `reservaId`, `jugadorId`, `complejoId`, `puntaje`, `comentario?`. `@@unique([reservaId, jugadorId])`                                                           |
| `Disputa`                      | El jugador reclama un "no se presentó" del dueño; **la resuelve el ADMIN** | `reservaId` único, `jugadorId`, `estado` ABIERTA/RESUELTA, `decision?`, `adminId?`                                                                             |
| `EtiquetaReserva`              | El que reservó etiqueta amigos en un partido jugado                        | `reservaId`, `jugadorId`, `etiquetadoPor`                                                                                                                      |
| `Ticket` (+ `EvidenciaTicket`) | Penalización del admin a un jugador                                        | `jugadorId`, `adminId`, `estado`, `venceEn`                                                                                                                    |
| `Intento`                      | Límite de intentos de login                                                | `clave`, `createdAt`                                                                                                                                           |

**Enums:** `Rol`, `EstadoAprobacion` (PENDIENTE/APROBADO/RECHAZADO), `Deporte`, `TipoSuperficie`, `EstadoReserva` (PENDIENTE/CONFIRMADA/CANCELADA), `EstadoDisputa`, `DecisionDisputa`, `TipoEvidencia`, `EstadoTicket`.

**Relación con nombre:** `Usuario` tiene varias relaciones con la misma tabla, por eso llevan nombre: `@relation("JugadorReservas")`, `@relation("DuenioComplejos")`, `@relation("ParticipacionesDelJugador")`… Si agregás una relación nueva hacia `Usuario`, va con nombre **en los dos lados**.

---

## 2. Ideas no obvias que explican medio código

1. **Los turnos no son una tabla.** Se calculan con `generateSlots(horaApertura, horaCierre, duracionTurnoMin)` (`lib/time.ts`). Un turno está ocupado si hay una `Reserva` que empieza a esa hora.
2. **Configuración en cascada.** `cancha.porcentajeSena ?? cancha.complejo.porcentajeSenaDefault` (igual con `minAdvanceMinutes`). `null` en la cancha = usa el del complejo.
3. **Horas como texto `"HH:MM"`** y se comparan como texto (`"19:15" > "19:00"`). Un turno que termina a medianoche tiene fin `"00:00"`: se compara como `"24:00"`.
4. **`fecha` es un día sin hora** (`@db.Date`). Para pasarla a texto: `diaDeReserva(fecha)` → `"YYYY-MM-DD"`. Para filtrar en Prisma hay que pasar un **`Date`**, no el texto: `fecha: new Date('2026-11-26')`.
5. **La pendiente vence sola.** Si no paga la seña en 15 min (`MINUTOS_PARA_PAGAR_SENA`), las consultas la ignoran con `NOT: pendientesVencidas()` (`lib/bookings.ts`). No hay cron.
6. **Baja lógica.** Complejos y canchas no se borran: `activo = false`. Casi todo `where` lleva `activo: true`.
7. **`precioTurno` queda congelado** al reservar: si el dueño cambia el precio, la reserva no cambia.
8. **`jugadores`**: cuántos van. `null` = reserva completa. Si falta gente, otros pueden sumarse (`join`).
9. **El precio, la seña y las reglas se calculan en el servidor.** Nunca se confía en lo que manda el navegador.

---

## 3. Mapa de endpoints (`app/api/`)

| Ruta                                   | Métodos              | Rol     | Qué hace                                                           |
| -------------------------------------- | -------------------- | ------- | ------------------------------------------------------------------ |
| `bookings`                             | POST                 | JUGADOR | Crear reserva (el controlador más largo: lista de chequeos)        |
| `bookings/[id]`                        | PATCH                | JUGADOR | Cancelar (devuelve o no la seña según `refundsDeposit`)            |
| `bookings/[id]/deposit`                | POST                 | JUGADOR | Pagar seña: PENDIENTE → CONFIRMADA + crea `Pago`                   |
| `bookings/[id]/join`                   | POST, DELETE         | JUGADOR | Sumarse / salirse de una reserva incompleta (antes de que empiece) |
| `bookings/[id]/players`                | PATCH                | JUGADOR | Editar cuántos jugadores van                                       |
| `bookings/[id]/rating`                 | POST                 | JUGADOR | Calificar el complejo después de jugar                             |
| `bookings/[id]/tags`                   | POST, DELETE         | JUGADOR | Etiquetar amigos en un partido jugado                              |
| `bookings/[id]/attendance`             | PATCH                | DUENIO  | Marcar asistió / no asistió                                        |
| `courts/[id]/availability`             | GET                  | sesión  | Turnos del día (`getAvailableSlots`)                               |
| `courts/[id]`                          | PATCH, DELETE        | DUENIO  | Editar / dar de baja cancha                                        |
| `courts/[id]/blocks`, `blocks/[id]`    | POST / PATCH, DELETE | DUENIO  | Bloqueos                                                           |
| `courts/[id]/prices`, `prices/[id]`    | POST / PATCH, DELETE | DUENIO  | Precios especiales                                                 |
| `complexes`                            | POST                 | sesión  | Crear complejo                                                     |
| `complexes/[id]`                       | PATCH, DELETE        | DUENIO  | Editar / dar de baja complejo                                      |
| `complexes/[id]/courts`                | POST                 | DUENIO  | Crear canchas                                                      |
| `complexes/[id]/images…`               | POST, DELETE         | DUENIO  | Fotos                                                              |
| `disputes`, `disputes/[id]/evidence`   | POST                 | JUGADOR | Abrir disputa por no-show / subir evidencia                        |
| `admin/disputes/[id]`                  | PATCH                | ADMIN   | Resolver disputa                                                   |
| `admin/complexes/[id]`                 | PATCH                | ADMIN   | Aprobar / rechazar complejo                                        |
| `admin/users/[id]`                     | PATCH                | ADMIN   | Suspender / reactivar                                              |
| `admin/tickets`, `admin/tickets/[id]`  | POST / PATCH         | ADMIN   | Tickets                                                            |
| `users`, `users/me`, `users/me/avatar` | varios               | sesión  | Registro, perfil, foto                                             |

**Status que usa el proyecto:** 400 datos inválidos · 401 sin sesión · 403 rol o persona equivocada · 404 no existe o no es tuyo · 409 choca con una regla.

---

## 4. Páginas por rol (`app/(dashboard)/`)

| Rol     | Página                   | Qué muestra                                                                                                                                                                                                |
| ------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Jugador | `jugador/canchas`        | Buscar canchas                                                                                                                                                                                             |
|         | `jugador/complejos/[id]` | Complejo → `CourtCard` → `CourtBookingSheet` → `CourtSlotPicker` (reservar)                                                                                                                                |
|         | `jugador/reservas`       | Pestañas Próximas / Historial / Canceladas. Trae las del jugador **y** a las que se sumó (`OR: [{ jugadorId }, { participantes: { some: { jugadorId } } }]`). En historial: calificar, disputar, etiquetar |
|         | `jugador/ranking`        | Puntos y niveles (`lib/gamificacion.ts`)                                                                                                                                                                   |
| Dueño   | `dueno/complejos/...`    | ABM de complejos, canchas, bloqueos, precios                                                                                                                                                               |
|         | `dueno/reservas`         | Reservas de **sus** canchas (`cancha: { complejo: { duenioId } }`). Botones de asistencia (`AttendanceButtons`)                                                                                            |
|         | `dueno/dashboard`        | Métricas                                                                                                                                                                                                   |
| Admin   | `admin/...`              | Complejos por aprobar, disputas, tickets, usuarios, reservas                                                                                                                                               |
| Todos   | `perfil`                 | Datos de la cuenta                                                                                                                                                                                         |

En `jugador/reservas/page.tsx`: `getReservas()` hace la consulta, `datosDelHistorial()` calcula qué botones van (`puedeCalificar`, `puedeDisputar`, `puedeEtiquetar`…), y se dibuja dos veces: **`TarjetaHistorial`** (celular) y **`FilaReserva`** (tabla, pantallas grandes). Un cambio visible va en las dos.

---

## 5. Plantilla

**Schema zod** (`lib/validations/*.ts`, se usa en el form **y** en el endpoint)

```ts
export const algoSchema = z.object({
  texto: z.string().trim().min(1, 'Completá el campo').max(100),
  numero: z.number().int().min(0),
  opcion: z.enum(['A', 'B']),
  opcional: z.string().trim().optional(),
})
```

En un input, `e.target.value` **siempre es texto**: para un campo numérico, `Number(e.target.value)`; para texto, se deja como está.

---

## 6. Prisma: lo que más se usa

```ts
db.reserva.findUnique({ where: { id } })                       // por id o campo @unique
db.reserva.findFirst({ where: { canchaId, fecha, horaInicio } })
db.reserva.findMany({ where, include, orderBy, skip, take })
db.reserva.count({ where })
db.reserva.create({ data: { ... } })
db.reserva.update({ where: { id }, data: { ... } })
db.reserva.updateMany({ where: { id, estado: 'PENDIENTE' }, data: { estado: 'CONFIRMADA' } })
db.algo.upsert({ where: { campoUnico }, create: { ... }, update: { ... } })
db.$transaction(async (tx) => {                                // todo o nada (así lo usa deposit)
  await tx.reserva.updateMany({ ... })
  await tx.pago.create({ ... })
})
```

## 11. Comandos y errores típicos

**Cambié el schema:**

```bash
npm run db:migrate      # pide un nombre; crea prisma/migrations/<fecha>_<nombre>/ y aplica a la base
npm run db:generate     # regenera lib/generated/prisma
# cortar y volver a levantar:  npm run dev
```

**Usuarios de la demo** (clave `Asd123`): `jugador@tocayjuga.com`, `dueno@tocayjuga.com` (Salguero, Grün, Caballito Norte), `admin@tocayjuga.com`, `sofia.paz@tocayjuga.com` (dueña), `lucas.martinez@tocayjuga.com` y otros jugadores. Las fechas del seed son relativas al día en que se corre.
