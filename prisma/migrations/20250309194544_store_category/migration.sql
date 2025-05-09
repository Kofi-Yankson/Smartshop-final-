-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" REAL NOT NULL DEFAULT 5.7744,
    "longitude" REAL NOT NULL DEFAULT -0.2133
);
INSERT INTO "new_Customer" ("email", "id", "location", "name", "password") SELECT "email", "id", "location", "name", "password" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "priceInPeswass" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'General',
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "searchCount" INTEGER NOT NULL DEFAULT 0,
    "storeId" TEXT NOT NULL,
    CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("id", "imagePath", "name", "priceInPeswass", "searchCount", "storeId") SELECT "id", "imagePath", "name", "priceInPeswass", "searchCount", "storeId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Retail',
    "description" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL,
    "latitude" REAL NOT NULL DEFAULT 5.7744,
    "longitude" REAL NOT NULL DEFAULT -0.2133,
    "searchCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Store" ("id", "latitude", "location", "longitude", "name", "searchCount") SELECT "id", "latitude", "location", "longitude", "name", "searchCount" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
