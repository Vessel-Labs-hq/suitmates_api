import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { DateHelper, ErrorHelper, PasswordHelper, Utils } from 'src/utils';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { Prisma } from '@prisma/client';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(userInfo: RegisterUserDto) {
    const hashedPassword = await PasswordHelper.hashPassword(
      userInfo.password,
    );

    userInfo.password = hashedPassword;

    const data: Prisma.UserCreateArgs = {
      data: {
        email: userInfo.email,
        password: userInfo.password,
      },
    };
    return await this.prisma.user.create(data);
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }
}