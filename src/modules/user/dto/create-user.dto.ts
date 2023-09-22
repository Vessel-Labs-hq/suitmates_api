import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
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

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  business_name: string;

  @IsString()
  @IsNotEmpty()
  days_of_business: string;

  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsString()
  @IsNotEmpty()
  hours_of_business_open: string;

  @IsString()
  @IsNotEmpty()
  hours_of_business_close: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  website: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  license: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bio: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  role: string; // 'tenant' or 'owner'
}
