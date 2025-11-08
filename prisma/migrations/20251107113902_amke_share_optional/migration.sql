/*
  Warnings:

  - The `like` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `share` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "pic" SET DEFAULT '',
DROP COLUMN "like",
ADD COLUMN     "like" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "share",
ADD COLUMN     "share" INTEGER DEFAULT 0;
