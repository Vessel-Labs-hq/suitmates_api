"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHelper = void 0;
const common_1 = require("@nestjs/common");
class ErrorHelper {
    static BadRequestException(msg) {
        throw new common_1.HttpException(msg, common_1.HttpStatus.BAD_REQUEST);
    }
    static UnauthorizedException(msg) {
        throw new common_1.HttpException(msg, common_1.HttpStatus.UNAUTHORIZED);
    }
    static NotFoundException(msg) {
        throw new common_1.HttpException(msg, common_1.HttpStatus.NOT_FOUND);
    }
    static ForbiddenException(msg) {
        throw new common_1.HttpException(msg, common_1.HttpStatus.FORBIDDEN);
    }
    static InternalServerErrorException(msg) {
        throw new common_1.HttpException(msg, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    static ConflictException(msg) {
        throw new common_1.HttpException(msg, common_1.HttpStatus.CONFLICT);
    }
}
exports.ErrorHelper = ErrorHelper;
//# sourceMappingURL=error.utils.js.map