import { Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/utils';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { EmailService } from './../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    private emailService: EmailService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      ErrorHelper.BadRequestException(`No user found for email: ${email}`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      ErrorHelper.UnauthorizedException('Invalid password');
    }
    return await this.signUserToken(user);
  }

  async register(payload: RegisterUserDto) {
    const emailExists = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (emailExists) {
      ErrorHelper.ConflictException(
        `User with email "${payload.email}" already exist`,
      );
    }
    const newUser = await this.userService.register(payload);

    return await this.signUserToken(newUser);
  }

  async registerTenant(payload: RegisterTenantDto){
    const emailExists = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (emailExists) {
      ErrorHelper.ConflictException(
        `User with email "${payload.email}" already exist`,
      );
    }
    const password: string = this.generateRandomString(8)
    const data = {
      email: payload.email,
      password: password,
      role: 'tenant',
    }
    const newUser = await this.userService.register(data);
    await this.emailService.sendUserWelcome(payload.email, password);
    return newUser;

  }

  private async signUserToken(user: any) {
    const userInfo = {
      role: user.role,
      email: user.email,
      id: user.id,
      onboarded: user.onboarded,
      verified: user.verified
    };

    const token = this.jwtService.sign(userInfo);

    return {
      ...userInfo,
      accessToken: token,
    };
  }

  private generateRandomString(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
}