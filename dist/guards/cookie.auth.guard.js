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
exports.CookieAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("../utils");
let CookieAuthGuard = class CookieAuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        if (!req?.cookies) {
            utils_1.ErrorHelper.UnauthorizedException('Cookie header is missing');
        }
        const authorization = req?.cookies?.token;
        if (!authorization) {
            utils_1.ErrorHelper.UnauthorizedException('Authorization token is missing');
        }
        const user = await this.verifyAccessToken(authorization);
        Object.assign(req, { user });
        return true;
    }
    async verifyAccessToken(accessToken) {
        if (!accessToken) {
            utils_1.ErrorHelper.UnauthorizedException('Access token is missing');
        }
        try {
            const payload = this.jwtService.verify(accessToken);
            const user = payload;
            if (!user) {
                utils_1.ErrorHelper.UnauthorizedException('Unauthorized Exception');
            }
            return user;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                utils_1.ErrorHelper.UnauthorizedException('Token expired');
            }
            utils_1.ErrorHelper.UnauthorizedException(error.message);
        }
    }
};
exports.CookieAuthGuard = CookieAuthGuard;
exports.CookieAuthGuard = CookieAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], CookieAuthGuard);
//# sourceMappingURL=cookie.auth.guard.js.map