-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('Primary', 'Secondary');

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "type" "OrganizationType" NOT NULL DEFAULT 'Primary';
