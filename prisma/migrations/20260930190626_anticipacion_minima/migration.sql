-- AlterTable
ALTER TABLE "Cancha" ADD COLUMN     "minAdvanceMinutes" INTEGER;

-- AlterTable
ALTER TABLE "Complejo" ADD COLUMN     "minAdvanceMinutesDefault" INTEGER NOT NULL DEFAULT 0;
