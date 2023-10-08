"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVarsSchema = void 0;
const Joi = require("joi");
exports.envVarsSchema = Joi.object({
    PORT: Joi.number().default(7000)
});
//# sourceMappingURL=env.validator.js.map