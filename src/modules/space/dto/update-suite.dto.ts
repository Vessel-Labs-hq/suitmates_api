import {IsNotEmpty, IsString} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSuiteDto } from './create-suite.dto';

export class UpdateSuiteDto extends PartialType(CreateSuiteDto) {

  @IsNotEmpty()
  @IsString()
  suite_id: number;
}
