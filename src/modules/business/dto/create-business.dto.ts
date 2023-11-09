import {   
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength, } from "class-validator";

export class CreateBusinessDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    business_name: string;

    @IsString()
    @IsNotEmpty()
    days_of_business: string;

    @IsString()
    @IsNotEmpty()
    occupation: string;

    @IsString()
    @IsNotEmpty()
    hours_of_business_open: string;

    @IsString()
    @IsNotEmpty()
    hours_of_business_close: string;

    @IsString()
    @IsOptional()
    website: string;

    @IsString()
    @IsOptional()
    license: string;
}
