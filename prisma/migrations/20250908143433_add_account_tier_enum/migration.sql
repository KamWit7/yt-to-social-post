-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "summaryCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "accountTier" TEXT NOT NULL DEFAULT 'free',
    CONSTRAINT "UserUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserUsage" ("createdAt", "id", "lastUsed", "summaryCount", "updatedAt", "userId") SELECT "createdAt", "id", "lastUsed", "summaryCount", "updatedAt", "userId" FROM "UserUsage";
DROP TABLE "UserUsage";
ALTER TABLE "new_UserUsage" RENAME TO "UserUsage";
CREATE UNIQUE INDEX "UserUsage_userId_key" ON "UserUsage"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
