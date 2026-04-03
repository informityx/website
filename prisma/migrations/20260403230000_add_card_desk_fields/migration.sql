-- AlterTable
ALTER TABLE "CustomType" ADD COLUMN "showCardDeskInNav" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CustomType" ADD COLUMN "cardDeskSectionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CustomType_cardDeskSectionId_key" ON "CustomType"("cardDeskSectionId");

-- AddForeignKey
ALTER TABLE "CustomType" ADD CONSTRAINT "CustomType_cardDeskSectionId_fkey" FOREIGN KEY ("cardDeskSectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
