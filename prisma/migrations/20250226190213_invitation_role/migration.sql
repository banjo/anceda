/*
  Warnings:

  - Made the column `role` on table `invitation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "invitation" ALTER COLUMN "role" SET NOT NULL;
