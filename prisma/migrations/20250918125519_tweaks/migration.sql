-- AlterEnum
ALTER TYPE "public"."MVPType" ADD VALUE 'MOCKUP';

-- AlterTable
ALTER TABLE "public"."Experiment" ALTER COLUMN "type" SET DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "public"."Hypothesis" ALTER COLUMN "description" DROP NOT NULL;
