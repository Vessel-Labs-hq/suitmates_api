import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { StripePaymentModule } from '../stripe-payment/stripe-payment.module';

@Module({
  imports: [PrismaModule,StripePaymentModule],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
