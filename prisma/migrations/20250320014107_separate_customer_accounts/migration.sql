/*
  Warnings:

  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Customer` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "CustomerAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "CustomerAccount_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" REAL NOT NULL DEFAULT 5.7744,
    "longitude" REAL NOT NULL DEFAULT -0.2133
);
INSERT INTO "new_Customer" ("id", "latitude", "location", "longitude", "name") SELECT "id", "latitude", "location", "longitude", "name" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccount_email_key" ON "CustomerAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccount_customerId_key" ON "CustomerAccount"("customerId");
