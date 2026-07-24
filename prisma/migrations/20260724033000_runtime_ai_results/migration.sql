CREATE TABLE "RuntimeAiResult" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "feature" TEXT NOT NULL,
  "input" JSONB NOT NULL,
  "output" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "providerResponseId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RuntimeAiResult_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "RuntimeAiResult_userId_createdAt_idx" ON "RuntimeAiResult"("userId", "createdAt");
ALTER TABLE "RuntimeAiResult" ADD CONSTRAINT "RuntimeAiResult_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
