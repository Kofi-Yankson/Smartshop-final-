/*
  Warnings:

  - Added the required column `email` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "searchCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Store" ("id", "latitude", "location", "longitude", "name", "searchCount") SELECT "id", "latitude", "location", "longitude", "name", "searchCount" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
CREATE UNIQUE INDEX "Store_email_key" ON "Store"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
