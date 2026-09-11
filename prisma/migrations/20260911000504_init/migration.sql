-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('JUGADOR', 'DUENIO');

-- CreateEnum
CREATE TYPE "Deporte" AS ENUM ('FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11');

-- CreateEnum
CREATE TYPE "TipoSuperficie" AS ENUM ('CESPED_SINTETICO', 'CESPED_NATURAL', 'CEMENTO', 'PARQUET');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'NO_SHOW', 'COMPLETADA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "dni" TEXT,
    "telefono" TEXT,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complejo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "zona" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "duenioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complejo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagenComplejo" (
    "id" TEXT NOT NULL,
    "complejoId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ImagenComplejo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cancha" (
    "id" TEXT NOT NULL,
    "complejoId" TEXT NOT NULL,
    "deporte" "Deporte" NOT NULL,
    "tipoSuperficie" "TipoSuperficie" NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "precioBase" DECIMAL(10,2) NOT NULL,
    "horaApertura" TEXT NOT NULL,
    "horaCierre" TEXT NOT NULL,
    "duracionTurnoMin" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "canchaId" TEXT NOT NULL,
    "jugadorId" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");

-- CreateIndex
CREATE INDEX "Complejo_zona_idx" ON "Complejo"("zona");

-- CreateIndex
CREATE INDEX "Complejo_duenioId_idx" ON "Complejo"("duenioId");

-- CreateIndex
CREATE INDEX "ImagenComplejo_complejoId_idx" ON "ImagenComplejo"("complejoId");

-- CreateIndex
CREATE INDEX "Cancha_complejoId_idx" ON "Cancha"("complejoId");

-- CreateIndex
CREATE INDEX "Cancha_deporte_idx" ON "Cancha"("deporte");

-- CreateIndex
CREATE INDEX "Reserva_jugadorId_idx" ON "Reserva"("jugadorId");

-- CreateIndex
CREATE INDEX "Reserva_canchaId_fecha_idx" ON "Reserva"("canchaId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_canchaId_fecha_horaInicio_key" ON "Reserva"("canchaId", "fecha", "horaInicio");

-- AddForeignKey
ALTER TABLE "Complejo" ADD CONSTRAINT "Complejo_duenioId_fkey" FOREIGN KEY ("duenioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagenComplejo" ADD CONSTRAINT "ImagenComplejo_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "Complejo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cancha" ADD CONSTRAINT "Cancha_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "Complejo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
