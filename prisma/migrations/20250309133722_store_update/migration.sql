/*
  Warnings:

  - You are about to drop the column `email` on the `Store` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "searchCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Store" ("id", "latitude", "location", "longitude", "name", "searchCount") SELECT "id", "latitude", "location", "longitude", "name", "searchCount" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
