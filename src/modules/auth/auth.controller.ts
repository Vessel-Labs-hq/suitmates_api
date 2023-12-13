import { Controller,Param, Post, Body,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { HttpResponse } from 'src/utils/http-response.utils';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { IUser, User } from 'src/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { email, password }: LoginUserDto) {
    return this.authService.login(email, password);
  }

  @Post('sendEmail')
  async testEmail(){
    return await this.authService.testEmail()
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Owner)
  @Post('register-tenant')
  async registerTenant(@Body() registerTenantDto: RegisterTenantDto,@User() user: IUser) {
    await this.authService.registerTenant(registerTenantDto,user.id);
    return HttpResponse.success({
      data: '',
      message: 'Tenant invited successfully',
    });
  }

  @Post('verify-token')
  verifyToken(@Body() verifyTokenDto: VerifyTokenDto) {
    return this.authService.VerifyToken(verifyTokenDto);
  }

  @Post('resend-tenant-invite/:userId')
  async resendInviteMail(@Param('userId') userId: string,@User() owner: IUser){
    await this.authService.resendInviteMail(+userId,+owner.id);
    return HttpResponse.success({
      data: '',
      message: 'Tenant invited successfully',
    });
  }
}
