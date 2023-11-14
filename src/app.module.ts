import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './base';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { envVarsSchema } from './helpers/env.validator';
import { SpaceModule } from './modules/space/space.module';
import { BusinessModule } from './modules/business/business.module';
import { EmailModule } from './modules/email/email.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { StripePaymentModule } from './modules/stripe-payment/stripe-payment.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envVarsSchema,
    }),
    ScheduleModule.forRoot(),
    {
      ...JwtModule.register({
        secret: JWT_SECRET,
        signOptions: { expiresIn: '24h' },
      }),
      global: true,
    },
    PrismaModule,
    AuthModule,
    UserModule,
    SpaceModule,
    BusinessModule,
    EmailModule,
    MaintenanceModule,
    StripePaymentModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
