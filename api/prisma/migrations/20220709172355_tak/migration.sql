/*
  Warnings:

  - Added the required column `memLimit` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeLimit` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "memLimit" INTEGER NOT NULL,
ADD COLUMN     "timeLimit" INTEGER NOT NULL;
