import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Status } from '../../../enums/status.enum'; // Define the Status enum

export class SortMaintenanceDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDateString()
  created_at?: string;
}