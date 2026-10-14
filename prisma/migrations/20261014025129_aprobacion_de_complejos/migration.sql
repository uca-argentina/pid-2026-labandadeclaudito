-- CreateEnum
CREATE TYPE "EstadoAprobacion" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- AlterTable
ALTER TABLE "Complejo" ADD COLUMN     "estadoAprobacion" "EstadoAprobacion" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "motivoRechazo" TEXT;

-- Los complejos que ya existían estaban publicados: siguen visibles
UPDATE "Complejo" SET "estadoAprobacion" = 'APROBADO';
