import { Module } from '@nestjs/common';
import { StripePaymentService } from './stripe-payment.service';
import { StripePaymentController } from './stripe-payment.controller';
import { StripeModule } from '@sjnprjl/nestjs-stripe';
import { STRIPE_SECRET_KEY } from "src/base/config";

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: STRIPE_SECRET_KEY,
      config: {
        apiVersion: '2022-08-01',
      },
    }),
  ],
  exports: [StripePaymentService],
  controllers: [StripePaymentController],
  providers: [StripePaymentService]
})
export class StripePaymentModule {}
