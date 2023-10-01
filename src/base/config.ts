import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export const PORT = configService.get("PORT");
export const FRONTEND_URL = configService.get("FRONTEND_URL");
export const JWT_SECRET = configService.get("JWT_SECRET");
export const GOOGLE_CLIENT_ID = configService.get("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = configService.get("GOOGLE_CLIENT_SECRET");
export const Google_Client_Email = configService.get("Google_Client_Email ");
export const Google_Private_Key= configService.get("Google_Private_Key");

export const AWS_ACCESS_KEY_ID= configService.get("AWS_ACCESS_KEY_ID");
export const AWS_SECRET_ACCESS_KEY= configService.get("AWS_SECRET_ACCESS_KEY");
export const AWS_REGION= configService.get("AWS_REGION");
