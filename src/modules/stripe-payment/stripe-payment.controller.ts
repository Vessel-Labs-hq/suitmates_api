import { Controller, Get, Post, Body, UseGuards,Param,Req, Res ,Headers} from '@nestjs/common';
import { StripePaymentService } from './stripe-payment.service';
import { CardSaveDto } from './dto/card-save.dto';
import { CardUpdateDto } from './dto/card-update.dto';
import { AuthGuard } from "src/guards/auth.guard";
import { IUser, User } from "src/decorators";
import { HttpResponse } from "src/utils";
import {RequestWithRawBody} from "src/interfaces/request-with-raw-body.interface"


@Controller('stripe-payment')
export class StripePaymentController {
  constructor(
    private readonly stripePaymentService: StripePaymentService
    ) {}

  
}