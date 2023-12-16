import {IsNotEmpty, IsString,IsNumber, IsOptional } from 'class-validator';

export class CreateSpaceDto {

  @IsNotEmpty()
  @IsString()
  space_name:      string;
  
  @IsNotEmpty()
  @IsString()
  space_address:   string;
  
  @IsNotEmpty()
  @IsNumber()
  space_size:      string;
  
  @IsNotEmpty()
  @IsString()
  space_amenities: string;
  
  @IsOptional()
  @IsString()
  account_number:  string;
  
  @IsOptional()
  @IsString()
  account_name:    string;
  
  @IsOptional()
  @IsString()
  routing_number:  string;
}
