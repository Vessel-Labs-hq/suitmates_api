import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { ErrorHelper } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @Body() body: LoginUserDto,
  ) {
    try {
      const data = await this.authService.login(body.email, body.password);
      response.cookie('token', data.accessToken, {
        expires: new Date(Date.now() + 900000),
        // httpOnly: true,
        // secure: true,
      });

      return data;
    } catch (error) {
      ErrorHelper.BadRequestException(
        `An error occurred while logging in, please try again`,
      );
    }
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
