"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./database/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const base_1 = require("./base");
const user_module_1 = require("./modules/user/user.module");
const config_1 = require("@nestjs/config");
const env_validator_1 = require("./helpers/env.validator");
const suite_module_1 = require("./modules/suite/suite.module");
const business_module_1 = require("./modules/business/business.module");
const email_module_1 = require("./modules/email/email.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                validationSchema: env_validator_1.envVarsSchema,
            }),
            {
                ...jwt_1.JwtModule.register({
                    secret: base_1.JWT_SECRET,
                    signOptions: { expiresIn: "24h" },
                }),
                global: true,
            },
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule, user_module_1.UserModule, suite_module_1.SuiteModule, business_module_1.BusinessModule, email_module_1.EmailModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map