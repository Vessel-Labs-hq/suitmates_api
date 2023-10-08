"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../../utils");
const prisma_service_1 = require("../../database/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_service_1 = require("../user/user.service");
const email_service_1 = require("./../email/email.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, userService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.userService = userService;
        this.emailService = emailService;
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            utils_1.ErrorHelper.BadRequestException(`No user found for email: ${email}`);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            utils_1.ErrorHelper.UnauthorizedException('Invalid password');
        }
        return await this.signUserToken(user);
    }
    async register(payload) {
        const emailExists = await this.prisma.user.findUnique({
            where: { email: payload.email },
        });
        if (emailExists) {
            utils_1.ErrorHelper.ConflictException(`User with email "${payload.email}" already exist`);
        }
        const newUser = await this.userService.register(payload);
        return await this.signUserToken(newUser);
    }
    async registerTenant(payload) {
        const emailExists = await this.prisma.user.findUnique({
            where: { email: payload.email },
        });
        if (emailExists) {
            utils_1.ErrorHelper.ConflictException(`User with email "${payload.email}" already exist`);
        }
        const password = this.generateRandomString(8);
        const data = {
            email: payload.email,
            password: password,
            role: 'tenant',
        };
        const newUser = await this.userService.register(data);
        await this.emailService.sendUserWelcome(payload.email, password);
        return newUser;
    }
    async signUserToken(user) {
        const userInfo = {
            role: user.role,
            email: user.email,
            id: user.id,
            onboarded: user.onboarded,
            verified: user.verified
        };
        const token = this.jwtService.sign(userInfo);
        return {
            ...userInfo,
            accessToken: token,
        };
    }
    generateRandomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        user_service_1.UserService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map