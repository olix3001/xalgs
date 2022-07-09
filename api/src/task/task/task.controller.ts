import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
  Request,
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
  async submit(
    @Request() req,
    @Body('sourceCode') sourceCode: string,
    @Body('lang') lang: string,
    @Param('id') taskId,
  ) {
    if (
      isNaN(taskId) ||
      sourceCode == undefined ||
      sourceCode.length == 0 ||
      lang == undefined
    )
      throw new BadRequestException(
        'Expected taskId to be a number and sourceCode to be a string',
      );

    const subm = await this.prismaService.submission
      .create({
        data: {
          code: sourceCode,
          lang: lang,
          task: {
            connect: {
              id: parseInt(taskId),
            },
          },
          author: {
            connect: {
              id: parseInt(req.user.userId),
            },
          },
        },
      })
      .catch((e) => {
        throw new BadRequestException('Something is not yes');
      });

    this.taskQueue.submitTask(parseInt(taskId), subm.id);

    return { submissionId: subm.id };
  }
}
