-- CreateTable
CREATE TABLE "Preparation" (
    "id" TEXT NOT NULL,
    "canchaId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preparation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Preparation_canchaId_startDate_endDate_idx" ON "Preparation"("canchaId", "startDate", "endDate");

-- AddForeignKey
ALTER TABLE "Preparation" ADD CONSTRAINT "Preparation_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
