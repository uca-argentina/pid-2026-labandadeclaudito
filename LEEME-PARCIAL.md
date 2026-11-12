# Checklist parcial offline (jueves 12/11)

Probado el 2026-11-09 con la red bloqueada: `npm ci`, setup, `next dev`, `next build`, 417 tests unitarios y 219 de integración, subida de fotos.

## ANTES (con internet) — hacelo el miércoles

- [ ] Los cambios offline están en el repo que va a ser el fork (commit + PR + merge hasta `main`, o lo que use la cátedra). Si el fork no los trae, no hay `setup:local`, ni fuentes locales, ni fotos locales.
- [ ] Postgres local andando: `brew services start postgresql@15` y `pg_isready -h localhost -p 5432` dice "accepting connections".
- [ ] `npm ci` hecho al menos una vez con el `package-lock.json` del fork (deja los paquetes en `~/.npm`). Probá: `npm ci --offline` funciona.
- [ ] Ensayo real: apagá el wifi, cloná el fork en una carpeta nueva y corré los pasos de abajo. Si algo falla, fallá hoy y no el jueves.

## EL DÍA (sin internet)

```bash
git clone <fork> && cd <fork>
npm ci --offline            # o npm ci, si ya tenés node_modules
npm run setup:local         # crea la base "tocayjuga", .env, tablas y datos de prueba
npm run dev                 # http://localhost:3000
```

Usuarios de `setup:local` (casos de QA): `admin@demo.com` / `Admin1234` (dueño) · `jugador@demo.com` / `Jugador1234`.

## Datos como los de prod (seed-demo)

`seed-demo` es el script con el que se cargó la base de prod: 17 usuarios, 10 complejos reales, 27 canchas y ~266 reservas. Acá va con fotos locales (sin Unsplash) y usuarios sin foto (se ven las iniciales). **Borra todo** y solo corre si la base tiene únicamente usuarios `@tocayjuga.com`, así que primero hay que vaciarla:

```bash
psql -d tocayjuga -c "DO \$\$ DECLARE t text; BEGIN FOR t IN SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename <> '_prisma_migrations' LOOP EXECUTE format('TRUNCATE TABLE %I CASCADE', t); END LOOP; END \$\$;"
DEMO_PASSWORD='<la clave de la demo>' npm run db:seed-demo
```

Cuentas (todas con esa clave): `admin@tocayjuga.com` · `dueno@tocayjuga.com` · `jugador@tocayjuga.com` · `sofia.paz@tocayjuga.com` (dueña con un complejo por aprobar y uno rechazado).
Las fechas son relativas al día en que corre el seed (10 días atrás a 5 adelante) y la reserva pendiente de pago vence a los 15 minutos: **volvé a correrlo el día del parcial**.

## AL TERMINAR — entrega por pendrive (el proyecto tiene que levantar y llevar la base)

Con Postgres andando, desde la carpeta del proyecto:

```bash
npm run entregar     # guarda la base en respaldo.sql y borra .next y .env
```

Después copian la carpeta. Quien la reciba, con Postgres instalado, hace:

```bash
npm ci               # o copiar node_modules si no hay internet
npm run setup:local  # crea la base, el .env y carga respaldo.sql
npm run dev
```

- Si agregaste un modelo, usá `npm run db:migrate` (deja la migración en `prisma/migrations`). Con `db push` no queda archivo.
- Para seguir trabajando en tu máquina después de entregar: `npm run setup:local` (vuelve a crear el `.env` y carga el respaldo).
- Ensayalo el miércoles: `npm run entregar`, copiá la carpeta a otro lugar y levantala ahí con los 3 pasos.

## Si el examen pide un modelo nuevo

1. Agregar el modelo en `prisma/schema.prisma` (y la relación de vuelta en los otros modelos).
2. `npm run db:migrate` (pide un nombre) → anda offline con Postgres local.
3. `npm run db:generate` y **reiniciar** `npm run dev` (si no, `db.<modelo>` da `undefined`).
4. Si `db:migrate` se queja, plan B: `npx prisma db push`.

## Trampas

- **No uses `npm run db:dev`** (`prisma dev`): sin internet se cuelga ("Fetching latest updates…").
- El seed **borra todo**. `setup:local` se niega si el `.env` no apunta a localhost; no lo fuerces.
- `.env` con `UPLOADS_LOCAL="true"`: las fotos subidas van a `public/uploads` (en `next dev` se ven; con `next start` hay que reiniciar para que aparezcan).
- Otra base distinta: `npm run setup:local -- nombre_de_la_base`.
- Tests: `npm test` (unitarios) y `npm run test:integration` (usan la base del `.env`: que sea la local).
- Postgres 18 (EnterpriseDB) está en el puerto 5433 con contraseña: no es el que usamos. El de Homebrew (15) está en el 5432 y no pide contraseña.

## Windows

`setup:local` y `entregar` son scripts de Node: andan igual que en Mac, sin bash.

- Instalá Postgres (instalador de EnterpriseDB) y acordate de la contraseña del usuario `postgres`. Tiene que quedar andando en el puerto 5432 (el servicio arranca solo).
- `npm run setup:local` te pregunta esa contraseña la primera vez (cuando no hay `.env`) y la guarda en el `.env`. No hace falta poner `psql` en el PATH: el script lo busca en `C:\Program Files\PostgreSQL`.
- Otro puerto, usuario o clave sin preguntar: variables `PGPORT`, `PGUSER`, `PGPASSWORD` (en PowerShell: `$env:PGPASSWORD="clave"; npm run setup:local`).
- Para vaciar la base antes de `seed-demo` (sección de arriba), el comando con `$$` no sirve en PowerShell. Abrí `psql -U postgres -d tocayjuga` y pegá ahí el bloque `DO ... END $$;` sin las barras `\`.
- Si `npm run entregar` dice que no pudo borrar `.next`, cerrá `npm run dev` y borrala a mano.
