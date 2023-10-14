import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { HttpResponse } from 'src/utils/http-response.utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { email, password }: LoginUserDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('register-tenant')
  async registerTenant(@Body() registerTenantDto: RegisterTenantDto) {
    
    await this.authService.registerTenant(registerTenantDto);
    return HttpResponse.success({
      data: "",
      message: 'Tenant invited successfully',
    });
  }

  @Post('verify-token')
  verifyToken(@Body() verifyTokenDto: VerifyTokenDto){
    return this.authService.VerifyToken(verifyTokenDto);
  }
}
