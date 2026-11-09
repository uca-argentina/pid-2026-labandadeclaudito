#!/bin/bash
# Prepara el proyecto para andar SIN internet: base Postgres local, .env,
# tablas y datos de prueba.
#
# Antes (con internet):  npm ci   y tener Postgres (brew install postgresql@15)
# Después:               npm run setup:local   y   npm run dev
#
# Uso:  bash scripts/setup-local.sh [nombre_de_la_base]    (por defecto: tocayjuga)

set -e
BASE="${1:-tocayjuga}"

# Postgres tiene que estar corriendo en este puerto
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
  echo "No hay Postgres en localhost:5432. Arrancalo con: brew services start postgresql@15"
  exit 1
fi

# La base (si ya existe, no pasa nada)
createdb -h localhost -p 5432 "$BASE" 2>/dev/null && echo "Base $BASE creada" || echo "La base $BASE ya existía"

# El .env: si no hay, se crea apuntando a la base local
if [ ! -f .env ]; then
  cat > .env <<ENV
DATABASE_URL="postgresql://$USER@localhost:5432/$BASE"
AUTH_SECRET="$(openssl rand -base64 32)"
UPLOADS_LOCAL="true"
ENV
  echo ".env creado"
fi

# El seed BORRA todo: nunca contra una base que no sea la local
if ! grep -qE '^DATABASE_URL=.*@(localhost|127\.0\.0\.1)[:/]' .env; then
  echo "ERROR: el DATABASE_URL de .env no es de localhost. No toco la base."
  echo "Borrá o renombrá el .env y corré de nuevo este script."
  exit 1
fi

npx prisma migrate deploy
npx prisma db seed
echo "Listo. Ahora: npm run dev"
