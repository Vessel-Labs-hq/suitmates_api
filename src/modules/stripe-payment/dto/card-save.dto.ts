import { IsNumber, IsNotEmpty,IsString } from "class-validator";

export class CardSaveDto {
    @IsString()
    @IsNotEmpty()
    paymentMethodId: string;
  
    @IsString()
    @IsNotEmpty()
    cardName: string;
  
    @IsString()
    @IsNotEmpty()
    cardLastNumber: string;
}
