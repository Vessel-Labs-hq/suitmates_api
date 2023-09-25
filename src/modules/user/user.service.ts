import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { DateHelper, ErrorHelper, PasswordHelper, Utils } from 'src/utils';
import { RegisterUserDto } from '../auth/dto/register-user.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(userInfo: RegisterUserDto) {
    const hashedPassword = await PasswordHelper.hashPassword(userInfo.password);

    userInfo.password = hashedPassword;
    return this.prisma.user.create({
      data: userInfo,
    });
  }
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await PasswordHelper.hashPassword(
      createUserDto.password,
    );

    createUserDto.password = hashedPassword;

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
