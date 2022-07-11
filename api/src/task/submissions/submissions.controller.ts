import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { PdfService } from './pdf/pdf.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(
    private prismaService: PrismaService,
    private pdfService: PdfService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMySubmissions(@Request() req) {
    const ms = this.prismaService.submission
      .findMany({
        where: {
          author: {
            id: req.user.userId,
          },
        },
        select: {
          id: true,
          submittedAt: true,
          lang: true,
          isSuccess: true,
          isTested: true,
          task: {
            select: {
              id: true,
              name: true,
              timeLimit: true,
              memLimit: true,
            },
          },
          TestResults: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    return ms;
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/:task')
  async getMyTaskSubmissions(@Request() req, @Param('task') task: string) {
    const ms = this.prismaService.submission
      .findMany({
        where: {
          AND: [
            {
              author: {
                id: req.user.userId,
              },
            },
            {
              task: {
                id: parseInt(task),
              },
            },
          ],
        },
        select: {
          id: true,
          submittedAt: true,
          lang: true,
          isSuccess: true,
          isTested: true,
          task: {
            select: {
              id: true,
              name: true,
              timeLimit: true,
              memLimit: true,
            },
          },
          TestResults: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    return ms;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/code/:id')
  async getSourceCode(@Param('id') id: string) {
    const r = this.prismaService.submission
      .findFirst({
        where: {
          id: parseInt(id),
        },
        select: {
          id: true,
          code: true,
          lang: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    return r;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/summary/:id')
  async generateSummary(
    @Request() req,
    @Param('id') id: string,
    @Response() res,
  ) {
    const r = await this.prismaService.submission
      .findFirst({
        where: {
          id: parseInt(id),
        },
        select: {
          author: {
            select: {
              id: true,
            },
          },
          id: true,
          submittedAt: true,
          code: true,
          lang: true,
          isTested: true,
          task: {
            select: {
              timeLimit: true,
              memLimit: true,
            },
          },
          TestResults: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    if (r == null) {
      throw new UnauthorizedException('');
    }
    if (!r.isTested) {
      throw new BadRequestException('This submission is not yet tested');
    }
    if (r.author.id != req.user.userId) {
      throw new UnauthorizedException(
        'Only person who made this submission can generate summary',
      );
    }

    this.pdfService.buildTestingResultPdf(r, res);
  }
}
