"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const filters_1 = require("./filters");
const rawBody_middleware_1 = require("./utils/rawBody.middleware");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const pipes_1 = require("./pipes");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('NestApplication');
    app.enableCors({
        origin: ['http://localhost:3000', '*'],
    });
    app.useGlobalPipes(new pipes_1.ValidationPipe());
    app.useGlobalFilters(new filters_1.HttpExceptionFilter());
    app.use((0, rawBody_middleware_1.default)());
    app.setGlobalPrefix('/api');
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT');
    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map