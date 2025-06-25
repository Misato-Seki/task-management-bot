/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Checklist` table. All the data in the column will be lost.
  - Added the required column `completed` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checklist" DROP COLUMN "completedAt",
DROP COLUMN "priority";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "completed" BOOLEAN NOT NULL;
