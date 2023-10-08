"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterTenantDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const login_user_dto_1 = require("./login-user.dto");
class RegisterTenantDto extends (0, mapped_types_1.PartialType)(login_user_dto_1.LoginUserDto) {
}
exports.RegisterTenantDto = RegisterTenantDto;
//# sourceMappingURL=register-tenant.dto.js.map