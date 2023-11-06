import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsEmail,
    IsNumber
  } from 'class-validator';
  
  export class AttachTenantDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsNumber()
    @IsNotEmpty()
    suite_id: number;
  }
  