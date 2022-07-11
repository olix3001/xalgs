import { Module } from '@nestjs/common';
import { TaskController } from './task/task.controller';
import { TaskQueueService } from './task-queue/task-queue.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubmissionsController } from './submissions/submissions.controller';
import { PdfService } from './submissions/pdf/pdf.service';

@Module({
  controllers: [TaskController, SubmissionsController],
  providers: [TaskQueueService, PrismaService, PdfService],
})
export class TaskModule {}
