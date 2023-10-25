// maintenance-request.dto.ts
import { Status } from '@prisma/client';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateDateStatusRequestDto {
  @IsOptional()
  @IsDateString()
  repair_date?: string;

  @IsOptional()
  @IsString()
  repair_time?: string;

  @IsOptional()
  @IsString()
  status?: Status;
}
