-- CreateEnum
CREATE TYPE "TipoEvidencia" AS ENUM ('IMAGEN', 'VIDEO');

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "asistenciaMarcadaEn" TIMESTAMP(3);

-- Las reservas ya marcadas no tienen fecha de marca: se usa updatedAt como
-- aproximación para que sigan siendo disputables (si no, quedarían afuera).
UPDATE "Reserva" SET "asistenciaMarcadaEn" = "updatedAt" WHERE "asistio" IS NOT NULL;

-- AlterTable
-- La evidencia pasó de un texto simulado a archivos subidos a Vercel Blob
ALTER TABLE "Disputa" DROP COLUMN "evidencia";

-- CreateTable
CREATE TABLE "EvidenciaDisputa" (
    "id" TEXT NOT NULL,
    "disputaId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" "TipoEvidencia" NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EvidenciaDisputa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EvidenciaDisputa_disputaId_idx" ON "EvidenciaDisputa"("disputaId");

-- AddForeignKey
ALTER TABLE "EvidenciaDisputa" ADD CONSTRAINT "EvidenciaDisputa_disputaId_fkey" FOREIGN KEY ("disputaId") REFERENCES "Disputa"("id") ON DELETE CASCADE ON UPDATE CASCADE;