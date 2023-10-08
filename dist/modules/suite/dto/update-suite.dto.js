"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSuiteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_suite_dto_1 = require("./create-suite.dto");
class UpdateSuiteDto extends (0, mapped_types_1.PartialType)(create_suite_dto_1.CreateSuiteDto) {
}
exports.UpdateSuiteDto = UpdateSuiteDto;
//# sourceMappingURL=update-suite.dto.js.map