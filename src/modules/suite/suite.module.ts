import { Module } from '@nestjs/common';
import { SuiteService } from './suite.service';
import { SuiteController } from './suite.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SuiteController],
  providers: [SuiteService],
})
export class SuiteModule {}
