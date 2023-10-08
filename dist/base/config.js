"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_REGION = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.Google_Private_Key = exports.Google_Client_Email = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.JWT_SECRET = exports.FRONTEND_URL = exports.PORT = void 0;
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.PORT = configService.get("PORT");
exports.FRONTEND_URL = configService.get("FRONTEND_URL");
exports.JWT_SECRET = configService.get("JWT_SECRET");
exports.GOOGLE_CLIENT_ID = configService.get("GOOGLE_CLIENT_ID");
exports.GOOGLE_CLIENT_SECRET = configService.get("GOOGLE_CLIENT_SECRET");
exports.Google_Client_Email = configService.get("Google_Client_Email ");
exports.Google_Private_Key = configService.get("Google_Private_Key");
exports.AWS_ACCESS_KEY_ID = configService.get("AWS_ACCESS_KEY_ID");
exports.AWS_SECRET_ACCESS_KEY = configService.get("AWS_SECRET_ACCESS_KEY");
exports.AWS_REGION = configService.get("AWS_REGION");
//# sourceMappingURL=config.js.map