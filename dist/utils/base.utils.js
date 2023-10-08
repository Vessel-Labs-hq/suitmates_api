"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const isemail = require("isemail");
const error_utils_1 = require("./error.utils");
class Utils {
    static isEmailOrFail(email) {
        const valid = isemail.validate(email);
        if (!valid) {
            error_utils_1.ErrorHelper.BadRequestException("Invalid email");
        }
        return email;
    }
    static isEmail(email) {
        return isemail.validate(email);
    }
    static removeKeysFromObject(obj, keysToRemove) {
        const newObject = { ...obj };
        keysToRemove.forEach((key) => delete newObject[key]);
        return newObject;
    }
    static deleteEmptyFields(obj) {
        for (let key in obj) {
            if (obj && obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === "object") {
                    this.deleteEmptyFields(obj[key]);
                    if (Object.keys(obj[key]).length === 0) {
                        delete obj[key];
                    }
                }
                else if (obj[key] === "" ||
                    obj[key] === null ||
                    obj[key] === undefined) {
                    delete obj[key];
                }
            }
        }
        return obj;
    }
}
exports.Utils = Utils;
Utils.waitForTime = (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
};
//# sourceMappingURL=base.utils.js.map