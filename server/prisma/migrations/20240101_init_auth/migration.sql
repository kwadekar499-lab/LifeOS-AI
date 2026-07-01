-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "username" VARCHAR(30) NOT NULL,
ADD COLUMN     "fullName" VARCHAR(100) NOT NULL,
ADD COLUMN     "passwordHash" VARCHAR(255) NOT NULL,
ADD COLUMN     "timezone" VARCHAR(50) NOT NULL DEFAULT 'UTC',
ADD COLUMN     "locale" VARCHAR(10) NOT NULL DEFAULT 'en',
ADD COLUMN     "deletedAt" TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "token",
DROP COLUMN "refreshToken",
ADD COLUMN     "device" VARCHAR(100),
ADD COLUMN     "refreshTokenHash" VARCHAR(255) NOT NULL,
ADD COLUMN     "revokedAt" TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshTokenHash_key" ON "sessions"("refreshTokenHash");

-- CreateIndex
DROP INDEX "sessions_token_idx";
CREATE INDEX "sessions_userId_revokedAt_idx" ON "sessions"("userId", "revokedAt");
CREATE INDEX "sessions_refreshTokenHash_idx" ON "sessions"("refreshTokenHash");
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");