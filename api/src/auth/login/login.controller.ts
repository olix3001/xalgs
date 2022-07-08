import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('auth')
export class LoginController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('ping')
  async ping(@Request() req) {
    return {
      status: 'success',
      user: req.user,
    };
  }

  @Post('register')
  async register(@Body() req) {
    if (
      !req.username ||
      !req.password ||
      !req.email ||
      typeof req.username != 'string' ||
      typeof req.password != 'string' ||
      typeof req.email != 'string' ||
      req.username.length > 20 ||
      req.password.length > 30
    ) {
      throw new BadRequestException();
    }
    const creationResult = await this.usersService.createUser(
      req.username,
      req.password,
      req.email,
    );

    if (!creationResult) throw new ConflictException();
    else return creationResult;
  }
}
