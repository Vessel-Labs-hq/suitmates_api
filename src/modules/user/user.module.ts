import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { AwsS3Service } from 'src/aws/aws-s3.service';


@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService,AwsS3Service],
  exports: [UserService],
})
export class UserModule {}
