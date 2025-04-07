/*
  Warnings:

  - You are about to drop the `_SharedWith` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SharedWith" DROP CONSTRAINT "_SharedWith_A_fkey";

-- DropForeignKey
ALTER TABLE "_SharedWith" DROP CONSTRAINT "_SharedWith_B_fkey";

-- DropTable
DROP TABLE "_SharedWith";

-- CreateTable
CREATE TABLE "_file_shared_with" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_file_shared_with_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_file_shared_with_B_index" ON "_file_shared_with"("B");

-- AddForeignKey
ALTER TABLE "_file_shared_with" ADD CONSTRAINT "_file_shared_with_A_fkey" FOREIGN KEY ("A") REFERENCES "storage_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_file_shared_with" ADD CONSTRAINT "_file_shared_with_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
