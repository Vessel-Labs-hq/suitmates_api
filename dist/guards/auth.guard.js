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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const base_enum_1 = require("../enums/base.enum");
const utils_1 = require("../utils");
let AuthGuard = class AuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        let authorization;
        if (!req.headers) {
            authorization = req.handshake.headers[base_enum_1.RequestHeadersEnum.Authorization];
        }
        else {
            authorization = req.headers[base_enum_1.RequestHeadersEnum.Authorization];
        }
        if (!authorization) {
            utils_1.ErrorHelper.UnauthorizedException('Authorization header is missing');
        }
        const user = await this.verifyAccessToken(authorization);
        req.user = user;
        return true;
    }
    async verifyAccessToken(authorization) {
        const [bearer, accessToken] = authorization.split(' ');
        if (bearer !== 'Bearer') {
            utils_1.ErrorHelper.UnauthorizedException('Authorization should be Bearer');
        }
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
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map