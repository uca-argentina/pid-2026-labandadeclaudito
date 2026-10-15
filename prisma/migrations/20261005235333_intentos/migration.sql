-- CreateTable
CREATE TABLE "Intento" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Intento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Intento_clave_createdAt_idx" ON "Intento"("clave", "createdAt");
