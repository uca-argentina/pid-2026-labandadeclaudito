-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "courtId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Block_courtId_startDate_endDate_idx" ON "Block"("courtId", "startDate", "endDate");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Cancha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
