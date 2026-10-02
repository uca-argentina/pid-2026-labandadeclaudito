/*
  Warnings:

  - The values [COMPLETADA] on the enum `EstadoReserva` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoReserva_new" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'NO_SHOW');
ALTER TABLE "public"."Reserva" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Reserva" ALTER COLUMN "estado" TYPE "EstadoReserva_new" USING ("estado"::text::"EstadoReserva_new");
ALTER TYPE "EstadoReserva" RENAME TO "EstadoReserva_old";
ALTER TYPE "EstadoReserva_new" RENAME TO "EstadoReserva";
DROP TYPE "public"."EstadoReserva_old";
ALTER TABLE "Reserva" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
COMMIT;
