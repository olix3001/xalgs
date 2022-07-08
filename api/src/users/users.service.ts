import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as sha256 from 'crypto-js/sha256';
import * as uniqid from 'uniqid';

export type SafeUser = {
  username: string;
  email: string;
  id: number;
};

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  calculatePass(pass: string, salt: string): string {
    return sha256(pass + salt).toString();
  }

  async auth(email: string, pass: string): Promise<SafeUser | undefined> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) return undefined;

    const safeUser: SafeUser = {
      username: user.username,
      email: user.email,
      id: user.id,
    };
    return user.pass == this.calculatePass(pass, user.salt)
      ? safeUser
      : undefined;
  }

  async createUser(
    username: string,
    password: string,
    email: string,
  ): Promise<SafeUser | undefined> {
    const salt: string = uniqid.process().toString();
    var cUser = null;
    if (
      await this.prismaService.user.findFirst({
        where: {
          OR: [{ email: email }, { username: username }],
        },
      })
    ) {
      return null;
    }
    const user = await this.prismaService.user.create({
      data: {
        username: username,
        email: email,
        pass: this.calculatePass(password, salt),
        salt: salt,
      },
    });

    if (user)
      return { username: user.username, email: user.email, id: user.id };
  }
}
