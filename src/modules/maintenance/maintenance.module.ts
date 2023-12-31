import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from 'src/database/prisma.module';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UserModule, PrismaModule, NotificationModule],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, AwsS3Service],
})
export class MaintenanceModule {}
