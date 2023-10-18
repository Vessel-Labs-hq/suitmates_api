import {
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class AttachCardDto {

    @IsString()
    @IsNotEmpty()
    payment_method_id: string;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    customer_id: string;
  
    @IsString()
    @IsNotEmpty()
    card_last_digit: string;
  
    @IsString()
    @IsNotEmpty()
    card_name: string;
  }
  