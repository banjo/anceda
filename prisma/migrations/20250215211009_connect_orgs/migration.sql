-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "primaryOrganizationId" TEXT;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_primaryOrganizationId_fkey" FOREIGN KEY ("primaryOrganizationId") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
