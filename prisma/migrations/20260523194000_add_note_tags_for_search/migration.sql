-- AlterTable
ALTER TABLE `Note` ADD COLUMN `tags` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Note_subject_idx` ON `Note`(`subject`);
