/*
  Warnings:

  - You are about to drop the column `resultadoDadoPorId` on the `Reserva` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "resultadoDadoPorId",
ADD COLUMN     "resultadoCargadoPorId" TEXT;
