import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskQueueService } from '../task-queue/task-queue.service';

@Controller('task')
export class TaskController {
  constructor(
    private taskQueue: TaskQueueService,
    private prismaService: PrismaService,
  ) {}

  @Get(':id')
  async getTask(@Param('id') taskId) {
    if (isNaN(taskId))
      throw new BadRequestException('Expected taskId to be a number');
    return await this.prismaService.task
      .findFirst({
        where: {
          id: parseInt(taskId),
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }

  @Get()
  async getTasks() {
    return await this.prismaService.task
      .findMany({
        select: {
          id: true,
          name: true,
          stars: true,
          difficulty: true,
          completions: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  submit(@Body('sourceCode') sourceCode: string, @Param('id') taskId): string {
    if (isNaN(taskId) || sourceCode == undefined || sourceCode.length == 0)
      throw new BadRequestException(
        'Expected taskId to be a number and sourceCode to be a string',
      );
    this.taskQueue.submitTask(parseInt(taskId), sourceCode);

    return 'Task sucesfully submited';
  }
}
