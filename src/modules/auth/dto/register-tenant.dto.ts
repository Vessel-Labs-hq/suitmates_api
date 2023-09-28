// import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { PartialType } from '@nestjs/mapped-types';
import { LoginUserDto } from './login-user.dto';

export class RegisterTenantDto extends PartialType(LoginUserDto) {}
