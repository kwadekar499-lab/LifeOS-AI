-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'STREAMING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterTable: Add new columns to conversations
ALTER TABLE "conversations" 
ADD COLUMN IF NOT EXISTS "workspaceId" TEXT,
ADD COLUMN IF NOT EXISTS "summary" TEXT,
ADD COLUMN IF NOT EXISTS "lastMessage" TEXT,
ADD COLUMN IF NOT EXISTS "lastMessageAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- DropIndex: Remove old index, add new ones
DROP INDEX IF EXISTS "conversations_userId_createdAt_idx";
CREATE INDEX IF NOT EXISTS "conversations_userId_idx" ON "conversations"("userId");
CREATE INDEX IF NOT EXISTS "conversations_userId_lastMessageAt_idx" ON "conversations"("userId", "lastMessageAt" DESC);
CREATE INDEX IF NOT EXISTS "conversations_userId_isPinned_idx" ON "conversations"("userId", "isPinned" DESC);
CREATE INDEX IF NOT EXISTS "conversations_userId_deletedAt_idx" ON "conversations"("userId", "deletedAt");

-- AlterTable: Add new columns to messages
ALTER TABLE "messages"
ADD COLUMN IF NOT EXISTS "status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS "provider" TEXT,
ADD COLUMN IF NOT EXISTS "tokenInput" INTEGER,
ADD COLUMN IF NOT EXISTS "tokenOutput" INTEGER,
ADD COLUMN IF NOT EXISTS "latency" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "attachments" JSONB,
ADD COLUMN IF NOT EXISTS "toolCalls" JSONB,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- Update existing messages status to COMPLETED
UPDATE "messages" SET "status" = 'COMPLETED' WHERE "status" IS NULL;

-- DropIndex: Remove old message indexes, add new ones
DROP INDEX IF EXISTS "messages_userId_createdAt_idx";
CREATE INDEX IF NOT EXISTS "messages_conversationId_deletedAt_idx" ON "messages"("conversationId", "deletedAt");

-- Make updatedAt not null after migration
ALTER TABLE "messages" ALTER COLUMN "updatedAt" SET NOT NULL;

-- Create migration lock
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
VALUES (
  '20250625_add_conversation_engine',
  'handwritten',
  NOW(),
  '20250625_add_conversation_engine',
  NULL,
  NULL,
  NOW(),
  1
);