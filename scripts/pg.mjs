// Ayudas para hablar con Postgres desde Node. Andan igual en Windows, Mac y Linux
// (por eso los scripts son .mjs y no .sh: en Windows no hay bash).
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'

const rutas = {}

// psql y pg_dump: se usan los del PATH. En Windows el instalador de Postgres no
// los agrega al PATH, así que se buscan en C:\Program Files\PostgreSQL\<versión>\bin.
export function programa(nombre) {
  if (rutas[nombre]) return rutas[nombre]
  let ruta = null
  if (spawnSync(nombre, ['--version']).status === 0) {
    ruta = nombre
  } else if (process.platform === 'win32' && existsSync('C:\\Program Files\\PostgreSQL')) {
    const versiones = readdirSync('C:\\Program Files\\PostgreSQL').sort((a, b) => b - a)
    for (const version of versiones) {
      const candidata = `C:\\Program Files\\PostgreSQL\\${version}\\bin\\${nombre}.exe`
      if (!ruta && existsSync(candidata)) ruta = candidata
    }
  }
  if (!ruta) {
    console.error(`No encuentro "${nombre}". ¿Está instalado Postgres?`)
    process.exit(1)
  }
  rutas[nombre] = ruta
  return ruta
}

// UTF8 fijo: el cliente de Windows usa otra codificación y rompe las tildes.
export const entorno = { ...process.env, PGCLIENTENCODING: 'UTF8' }

export function psql(url, argumentos, opciones = {}) {
  return spawnSync(programa('psql'), [url, ...argumentos], {
    encoding: 'utf8',
    env: entorno,
    ...opciones,
  })
}

// El DATABASE_URL del .env, sin los parámetros (?schema=...) que psql no entiende.
export function urlDelEnv() {
  if (!existsSync('.env')) {
    console.error('No hay .env. Corré antes: npm run setup:local')
    process.exit(1)
  }
  const linea = readFileSync('.env', 'utf8').match(/^DATABASE_URL="?([^"\r\n]+)"?/m)
  if (!linea) {
    console.error('El .env no tiene DATABASE_URL.')
    process.exit(1)
  }
  return linea[1].split('?')[0]
}
