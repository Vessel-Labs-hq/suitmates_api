import {IsNotEmpty, IsString} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSuiteInformationDto } from './create-suite-information.dto';

export class UpdateSuiteInformationDto extends PartialType(CreateSuiteInformationDto) {

  @IsNotEmpty()
  @IsString()
  suite_id: number;
}
