/*
  Warnings:

  - Added the required column `fileName` to the `storage_file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "storage_file" ADD COLUMN     "fileName" TEXT NOT NULL;
