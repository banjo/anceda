/*
  Warnings:

  - The values [Primary,Secondary] on the enum `OrganizationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrganizationType_new" AS ENUM ('PRIMARY', 'SECONDARY');
ALTER TABLE "organization" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "organization" ALTER COLUMN "type" TYPE "OrganizationType_new" USING ("type"::text::"OrganizationType_new");
ALTER TYPE "OrganizationType" RENAME TO "OrganizationType_old";
ALTER TYPE "OrganizationType_new" RENAME TO "OrganizationType";
DROP TYPE "OrganizationType_old";
ALTER TABLE "organization" ALTER COLUMN "type" SET DEFAULT 'PRIMARY';
COMMIT;

-- AlterTable
ALTER TABLE "organization" ALTER COLUMN "type" SET DEFAULT 'PRIMARY';
