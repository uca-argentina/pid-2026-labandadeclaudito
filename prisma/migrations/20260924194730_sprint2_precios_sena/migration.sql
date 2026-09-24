/*
  Warnings:

  - Added the required column `precioTurno` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cancha" ADD COLUMN     "porcentajeSena" INTEGER;

-- AlterTable
ALTER TABLE "Complejo" ADD COLUMN     "porcentajeSenaDefault" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "precioTurno" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "PrecioEspecial" (
    "id" TEXT NOT NULL,
    "canchaId" TEXT NOT NULL,
    "diaSemana" INTEGER,
    "horaInicio" TEXT,
    "horaFin" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PrecioEspecial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "porcentaje" INTEGER NOT NULL,
    "devuelto" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrecioEspecial_canchaId_idx" ON "PrecioEspecial"("canchaId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_reservaId_key" ON "Pago"("reservaId");

-- AddForeignKey
ALTER TABLE "PrecioEspecial" ADD CONSTRAINT "PrecioEspecial_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
