#!/bin/bash
# Deja la carpeta lista para copiarla: guarda la base en respaldo.sql y limpia
# lo que se regenera solo (.next y .env). Corrélo al terminar, con Postgres andando.
#
# Quien reciba la carpeta hace:  npm ci  →  npm run setup:local  →  npm run dev
# (setup:local crea la base, el .env y carga respaldo.sql)

set -e
URL=$(grep '^DATABASE_URL=' .env | cut -d= -f2- | tr -d '"')
# El grep saca líneas que pg_dump nuevo agrega y los Postgres más viejos no entienden.
pg_dump --clean --if-exists --no-owner --no-privileges "${URL%%\?*}" \
  | grep -vE '^(SET transaction_timeout|\\restrict|\\unrestrict)' > respaldo.sql
rm -rf .next .env
echo "Listo: respaldo.sql guardado ($(wc -l < respaldo.sql) líneas). Se borraron .next y .env."
echo "Para seguir trabajando acá: npm run setup:local (vuelve a crear el .env y carga el respaldo)."
