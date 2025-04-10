/*
  Warnings:

  - A unique constraint covering the columns `[publicUrl]` on the table `storage_file` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicUrl` to the `storage_file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "storage_file" ADD COLUMN     "publicUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "storage_file_publicUrl_key" ON "storage_file"("publicUrl");
