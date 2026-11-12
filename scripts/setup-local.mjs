// Prepara el proyecto para andar SIN internet: base Postgres local, .env,
// tablas y datos. Funciona en Windows, Mac y Linux.
//
// Antes (con internet):  npm ci   y tener Postgres instalado y andando
// Después:               npm run setup:local   y   npm run dev
//
// Uso:  npm run setup:local [-- nombre_de_la_base]    (por defecto: tocayjuga)
//
// Sin respaldo.sql carga los datos de la demo (prisma/seed-demo.ts, iguales a prod).
// La clave de todas las cuentas es Asd123, o la de la variable DEMO_PASSWORD.
//
// Si no hay .env, arma la conexión con estos datos (se pueden cambiar con variables):
//   PGUSER      usuario    (Windows: postgres; Mac/Linux: tu usuario del sistema)
//   PGPASSWORD  contraseña (Windows: te la pregunta; Mac con Homebrew: sin contraseña)
//   PGPORT      puerto     (5432)
import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync, writeFileSync } from 'node:fs'
import { userInfo } from 'node:os'
import { createInterface } from 'node:readline/promises'
import { psql, urlDelEnv } from './pg.mjs'

const windows = process.platform === 'win32'

function fallar(mensaje) {
  console.error(mensaje)
  process.exit(1)
}

// 1) La URL de la base: la del .env si existe, si no se arma una
let url
if (existsSync('.env')) {
  url = urlDelEnv()
} else {
  const usuario = process.env.PGUSER ?? (windows ? 'postgres' : userInfo().username)
  let clave = process.env.PGPASSWORD
  if (clave === undefined && windows) {
    const consola = createInterface({ input: process.stdin, output: process.stdout })
    clave = await consola.question(`Contraseña de Postgres (usuario ${usuario}): `)
    consola.close()
  }
  const credenciales = clave ? `${usuario}:${encodeURIComponent(clave)}` : usuario
  const base = process.argv[2] ?? 'tocayjuga'
  url = `postgresql://${credenciales}@localhost:${process.env.PGPORT ?? 5432}/${base}`
}

// El seed BORRA todo: nunca contra una base que no sea la local
const conexion = new URL(url)
if (conexion.hostname !== 'localhost' && conexion.hostname !== '127.0.0.1') {
  fallar(
    'ERROR: el DATABASE_URL de .env no es de localhost. No toco la base.\nBorrá el .env y corré de nuevo.',
  )
}
const nombreDeLaBase = conexion.pathname.slice(1)

// 2) Postgres tiene que estar andando. Se conecta a la base "postgres", que siempre existe.
conexion.pathname = '/postgres'
const urlAdmin = conexion.href
const prueba = psql(urlAdmin, ['-tAc', 'select 1'])
if (prueba.status !== 0) {
  fallar(
    `No pude conectar a Postgres en ${conexion.host}. ¿Está andando? ¿La contraseña es correcta?\n${prueba.stderr}`,
  )
}

// 3) Crear la base (si ya existe, no pasa nada)
const existe = psql(urlAdmin, [
  '-tAc',
  `select 1 from pg_database where datname = '${nombreDeLaBase}'`,
])
if (existe.stdout.trim() === '1') {
  console.log(`La base ${nombreDeLaBase} ya existía`)
} else {
  const crear = psql(urlAdmin, ['-c', `create database "${nombreDeLaBase}"`])
  if (crear.status !== 0) fallar(crear.stderr)
  console.log(`Base ${nombreDeLaBase} creada`)
}

// 4) El .env, si no hay
if (!existsSync('.env')) {
  writeFileSync(
    '.env',
    `DATABASE_URL="${url}"\nAUTH_SECRET="${randomBytes(32).toString('base64')}"\nUPLOADS_LOCAL="true"\n`,
  )
  console.log('.env creado')
}

// shell: true porque en Windows npm y npx son .cmd
function correr(comando, entornoExtra = {}) {
  const paso = spawnSync(comando, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...entornoExtra },
  })
  if (paso.status !== 0) fallar(`Falló: ${comando}`)
}

// 5) Si la carpeta trae respaldo.sql (lo deja npm run entregar), se carga ese
// respaldo: tablas y datos tal cual estaban. Si no, migraciones + los datos de la
// demo (los mismos que prod: prisma/seed-demo.ts).
if (existsSync('respaldo.sql')) {
  const carga = psql(url, ['-q', '-v', 'ON_ERROR_STOP=1', '-f', 'respaldo.sql'], {
    stdio: ['ignore', 'ignore', 'inherit'],
  })
  if (carga.status !== 0) fallar('No se pudo cargar respaldo.sql')
  console.log('Respaldo cargado')
} else {
  correr('npx prisma migrate deploy')
  // seed-demo no corre si ya hay usuarios que no son de la demo (por ejemplo los
  // @demo.com de prisma/seed.ts), así que se vacían todas las tablas antes.
  const vaciar = `DO $$ DECLARE t text; BEGIN
    FOR t IN SELECT tablename FROM pg_tables
      WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
    LOOP EXECUTE format('TRUNCATE TABLE %I CASCADE', t); END LOOP;
  END $$;`
  const vaciado = psql(url, ['-c', vaciar])
  if (vaciado.status !== 0) fallar(vaciado.stderr)
  // La clave de todas las cuentas. Es una base local: sirve cualquiera.
  correr('npm run db:seed-demo', { DEMO_PASSWORD: process.env.DEMO_PASSWORD ?? 'Asd123' })
}
console.log('Listo. Ahora: npm run dev')
