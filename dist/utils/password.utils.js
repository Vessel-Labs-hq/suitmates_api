"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHelper = void 0;
const bcrypt = require("bcrypt");
class PasswordHelper {
    static hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
    static comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
exports.PasswordHelper = PasswordHelper;
//# sourceMappingURL=password.utils.js.map