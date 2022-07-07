import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { TaskQueueService } from '../task-queue/task-queue.service';

@Controller('task/:id')
export class TaskController {
  constructor(private taskQueue: TaskQueueService) {}

  @Post('submit')
  submit(@Body('sourceCode') sourceCode, @Param('id') taskId): string {
    if (isNaN(taskId))
      throw new BadRequestException('Expected taskId to be a number');
    this.taskQueue.submitTask(parseInt(taskId), sourceCode);

    return 'Task sucesfully submited';
  }
}
