-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "subscriptionExpiry" TIMESTAMP(3),
ALTER COLUMN "isVerified" SET DEFAULT false,
ALTER COLUMN "isActive" SET DEFAULT false;
