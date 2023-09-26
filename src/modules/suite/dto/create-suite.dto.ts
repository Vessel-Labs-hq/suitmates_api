import {IsNotEmpty, IsString } from 'class-validator';

export class CreateSuiteDto {

  @IsNotEmpty()
  @IsString()
  space_name:      string;
  
  @IsNotEmpty()
  @IsString()
  space_address:   string;
  
  @IsNotEmpty()
  @IsString()
  space_size:      number;
  
  @IsNotEmpty()
  @IsString()
  space_amenities: string;
  
  @IsNotEmpty()
  @IsString()
  account_number:  string;
  
  @IsNotEmpty()
  @IsString()
  account_name:    string;
  
  @IsNotEmpty()
  @IsString()
  routing_number:  string;
}