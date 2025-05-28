/*
  Warnings:

  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FlashcardSetToLabel` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "FlashcardSet" ADD COLUMN "labels" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Label";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_FlashcardSetToLabel";
PRAGMA foreign_keys=on;
