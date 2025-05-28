-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_FlashcardSetToLabel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FlashcardSetToLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "FlashcardSet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FlashcardSetToLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "Label" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_FlashcardSetToLabel_AB_unique" ON "_FlashcardSetToLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_FlashcardSetToLabel_B_index" ON "_FlashcardSetToLabel"("B");
