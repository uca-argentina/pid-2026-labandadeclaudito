// Deja la carpeta lista para copiarla: guarda la base en respaldo.sql y limpia
// lo que se regenera solo (.next y .env). Corrélo al terminar, con Postgres andando.
// Funciona en Windows, Mac y Linux.
//
// Quien reciba la carpeta hace:  npm ci  →  npm run setup:local  →  npm run dev
// (setup:local crea la base, el .env y carga respaldo.sql)
import { spawnSync } from 'node:child_process'
import { rmSync, writeFileSync } from 'node:fs'
import { entorno, programa, urlDelEnv } from './pg.mjs'

const volcado = spawnSync(
  programa('pg_dump'),
  ['--clean', '--if-exists', '--no-owner', '--no-privileges', urlDelEnv()],
  { encoding: 'utf8', env: entorno, maxBuffer: 1024 * 1024 * 512 },
)
if (volcado.status !== 0) {
  console.error(`pg_dump falló, no se tocó nada:\n${volcado.stderr}`)
  process.exit(1)
}

// Se sacan líneas que un pg_dump nuevo agrega y los Postgres más viejos no entienden.
const sql = volcado.stdout
  .split('\n')
  .filter((linea) => !/^(SET transaction_timeout|\\restrict|\\unrestrict)/.test(linea))
  .join('\n')
writeFileSync('respaldo.sql', sql)

try {
  rmSync('.next', { recursive: true, force: true })
  rmSync('.env', { force: true })
} catch {
  console.error('No pude borrar .next o .env: cerrá "npm run dev" y borralos a mano.')
}

console.log(
  `Listo: respaldo.sql guardado (${sql.split('\n').length} líneas). Se borraron .next y .env.`,
)
console.log(
  'Para seguir trabajando acá: npm run setup:local (vuelve a crear el .env y carga el respaldo).',
)
