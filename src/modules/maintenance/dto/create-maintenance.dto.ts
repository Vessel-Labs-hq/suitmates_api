import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class CreateMaintenanceDto {
    @IsNotEmpty()
    @IsString()
    category: string;

    @IsNotEmpty()
    @IsString()
    priority: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}