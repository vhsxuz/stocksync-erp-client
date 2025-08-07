-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "public"."ItemCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserItemCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "UserItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserItemCategory_userId_categoryId_key" ON "public"."UserItemCategory"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserItemCategory" ADD CONSTRAINT "UserItemCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserItemCategory" ADD CONSTRAINT "UserItemCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
