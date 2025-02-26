/*
  Warnings:

  - Changed the type of `status` on the `invitation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "invitation" DROP COLUMN "status",
ADD COLUMN     "status" "InvitationStatus" NOT NULL;
