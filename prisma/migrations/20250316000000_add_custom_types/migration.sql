-- CreateTable
CREATE TABLE "CustomType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "showInHeader" BOOLEAN NOT NULL DEFAULT true,
    "showInFooter" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "bannerBackgroundImage" TEXT,
    "bannerOverlayColor" TEXT,
    "bannerOverlayOpacity" DOUBLE PRECISION,
    "bannerTitle" TEXT,
    "bannerText" TEXT,
    "bannerButtonText" TEXT,
    "bannerButtonLink" TEXT,
    "bannerButtonVisible" BOOLEAN,
    "bannerImage" TEXT,
    "bannerHeightPercent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomType_slug_key" ON "CustomType"("slug");

-- AlterTable Section: add customTypeId, make pageId nullable
ALTER TABLE "Section" ADD COLUMN "customTypeId" TEXT;

ALTER TABLE "Section" ALTER COLUMN "pageId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Section_customTypeId_order_idx" ON "Section"("customTypeId", "order");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_customTypeId_fkey" FOREIGN KEY ("customTypeId") REFERENCES "CustomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
