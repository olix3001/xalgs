import { Module } from '@nestjs/common';
import { TaskController } from './task/task.controller';
import { TaskQueueService } from './task-queue/task-queue.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TaskController],
  providers: [TaskQueueService, PrismaService],
})
export class TaskModule {}
