/*
  Warnings:

  - You are about to drop the column `vendorId` on the `TransactionHeader` table. All the data in the column will be lost.
  - Added the required column `vendorId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."TransactionHeader" DROP CONSTRAINT "TransactionHeader_vendorId_fkey";

-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "vendorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."TransactionHeader" DROP COLUMN "vendorId";

-- CreateTable
CREATE TABLE "public"."SupplyTransactionHeader" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplyTransactionHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupplyTransactionDetail" (
    "id" TEXT NOT NULL,
    "supplyId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtPurchase" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SupplyTransactionDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupplyTransactionHeader" ADD CONSTRAINT "SupplyTransactionHeader_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupplyTransactionHeader" ADD CONSTRAINT "SupplyTransactionHeader_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupplyTransactionDetail" ADD CONSTRAINT "SupplyTransactionDetail_supplyId_fkey" FOREIGN KEY ("supplyId") REFERENCES "public"."SupplyTransactionHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupplyTransactionDetail" ADD CONSTRAINT "SupplyTransactionDetail_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
