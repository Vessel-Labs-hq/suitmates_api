import {IsNotEmpty, IsString} from 'class-validator';

export class CreateSuiteInformationDto {
  
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
  suite_cost: number;

  @IsNotEmpty()
  @IsString()
  timing: string;

}
