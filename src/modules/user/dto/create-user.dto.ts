import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsBoolean
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  phone_number: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsBoolean()
  onboarded: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  role: string; // 'tenant' or 'owner'
}
