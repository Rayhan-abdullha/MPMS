-- CreateEnum
CREATE TYPE "SprintStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Sprint" ADD COLUMN     "status" "SprintStatus" NOT NULL DEFAULT 'ACTIVE';
