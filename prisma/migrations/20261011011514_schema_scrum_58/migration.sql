-- CreateEnum
CREATE TYPE "EstadoDisputa" AS ENUM ('ABIERTA', 'RESUELTA');

-- CreateEnum
CREATE TYPE "DecisionDisputa" AS ENUM ('A_FAVOR_JUGADOR', 'A_FAVOR_DUENIO');

-- CreateTable
CREATE TABLE "Disputa" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "jugadorId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "evidencia" TEXT NOT NULL,
    "estado" "EstadoDisputa" NOT NULL DEFAULT 'ABIERTA',
    "decision" "DecisionDisputa",
    "comentarioAdmin" TEXT,
    "adminId" TEXT,
    "resueltaEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Disputa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Disputa_reservaId_key" ON "Disputa"("reservaId");

-- CreateIndex
CREATE INDEX "Disputa_estado_idx" ON "Disputa"("estado");

-- AddForeignKey
ALTER TABLE "Disputa" ADD CONSTRAINT "Disputa_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disputa" ADD CONSTRAINT "Disputa_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disputa" ADD CONSTRAINT "Disputa_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
