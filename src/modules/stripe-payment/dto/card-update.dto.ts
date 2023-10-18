import { CardSaveDto } from "./card-save.dto";
import { PartialType } from '@nestjs/mapped-types';


export class CardUpdateDto extends PartialType(CardSaveDto) {}
