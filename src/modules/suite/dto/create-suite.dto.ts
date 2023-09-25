import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSuiteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SuiteItemDto)
  suites: SuiteItemDto[];
}

export class SuiteItemDto {
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
  @IsString()
  suite_cost: string;

  @IsNotEmpty()
  @IsString()
  timing: string;
}
