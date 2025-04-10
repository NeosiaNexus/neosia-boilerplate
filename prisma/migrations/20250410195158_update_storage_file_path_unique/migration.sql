/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `storage_file` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "storage_file_path_key" ON "storage_file"("path");
