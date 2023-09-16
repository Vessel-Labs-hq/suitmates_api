import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET } from "./base";
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [{
    ...JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: "24h" },
    }),
    global: true,
  },
    PrismaModule, 
    AuthModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
