-- DropIndex
DROP INDEX "Reserva_canchaId_fecha_horaInicio_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_activa_unica" ON "Reserva"("canchaId", "fecha", "horaInicio") WHERE (estado <> 'CANCELADA');

