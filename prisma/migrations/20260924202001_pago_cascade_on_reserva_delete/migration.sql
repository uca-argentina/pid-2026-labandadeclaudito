-- DropForeignKey
ALTER TABLE "Pago" DROP CONSTRAINT "Pago_reservaId_fkey";

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;
