import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SafeUser, UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.auth(email, pass);
    return user || null;
  }

  async login(user: SafeUser) {
    const payload = {
      username: user.username,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
    };
  }
}
