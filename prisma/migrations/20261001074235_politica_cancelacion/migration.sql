-- AlterTable
ALTER TABLE "Complejo" ADD COLUMN     "cancellationHours" INTEGER NOT NULL DEFAULT 24;

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "cancellationHours" INTEGER NOT NULL DEFAULT 24;
