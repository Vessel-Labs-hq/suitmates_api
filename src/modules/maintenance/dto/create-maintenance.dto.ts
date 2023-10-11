import {IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class CreateMaintenanceDto {
    @IsNotEmpty()
    @IsString()
    suite_number: string;
}
