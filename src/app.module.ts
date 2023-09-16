import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET } from "./base";
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { envVarsSchema } from "./helpers/env.validator";


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    validationSchema: envVarsSchema,
  }),
  {
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
