import {IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSuitesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSuiteDto)
  suites: CreateSuiteDto[];
}

export class CreateSuiteDto {
  
  @IsNotEmpty()
  @IsString()
  suite_number: string;

  @IsNotEmpty()
  @IsString()
  suite_type: string;

  @IsNotEmpty()
  @IsString()
  suite_size: string;

  @IsNotEmpty()
  @IsNumber()
  suite_cost: number;

  @IsNotEmpty()
  @IsString()
  timing: string;

}
