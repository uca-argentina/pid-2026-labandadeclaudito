-- CreateEnum
CREATE TYPE "EstadoResultado" AS ENUM ('REGISTRADO', 'CONFIRMADO', 'PENDIENTE_CONFIRMACION');

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "estadoResultado" "EstadoResultado",
ADD COLUMN     "resultado" TEXT,
ADD COLUMN     "resultadoDadoPorId" TEXT;
