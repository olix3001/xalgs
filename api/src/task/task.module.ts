import { Module } from '@nestjs/common';
import { TaskController } from './task/task.controller';
import { TaskQueueService } from './task-queue/task-queue.service';

@Module({
  controllers: [TaskController],
  providers: [TaskQueueService],
})
export class TaskModule {}
