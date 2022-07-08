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
    if (isNaN(taskId) || sourceCode == undefined || sourceCode.length == 0)
      throw new BadRequestException(
        'Expected taskId to be a number and sourceCode to be a string',
      );
    this.taskQueue.submitTask(parseInt(taskId), sourceCode);

    return 'Task sucesfully submited';
  }
}
