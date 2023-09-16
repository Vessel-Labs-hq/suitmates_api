import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: String;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    first_name: String;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    last_name: String;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    phone_number: String;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    business_name: String;

    @IsString()
    @IsNotEmpty()
    days_of_business: String;

    @IsString()
    @IsNotEmpty()
    occupation: String;

    @IsString()
    @IsNotEmpty()
    hours_of_business_open: String;

    @IsString()
    @IsNotEmpty()
    hours_of_business_close: String;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    website: String;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    license: String;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    avatar: String;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    bio: String;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    role: String; // 'tenant' or 'owner'
}
