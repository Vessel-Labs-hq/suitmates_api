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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuiteController = void 0;
const common_1 = require("@nestjs/common");
const suite_service_1 = require("./suite.service");
const create_suite_dto_1 = require("./dto/create-suite.dto");
const update_suite_dto_1 = require("./dto/update-suite.dto");
const decorators_1 = require("../../decorators");
const create_suite_information_dto_1 = require("./dto/create-suite-information.dto");
const utils_1 = require("../../utils");
const auth_guard_1 = require("../../guards/auth.guard");
let SuiteController = class SuiteController {
    constructor(suiteService) {
        this.suiteService = suiteService;
    }
    async create(createSuiteDto, user) {
        const suite = await this.suiteService.createSuite(createSuiteDto, user.id);
        return utils_1.HttpResponse.success({
            data: suite,
            message: 'Suite created successfully',
        });
    }
    async createSuitInformation(createSuiteInformationDto, suite_id) {
        const info = await this.suiteService.createSuiteInformation(createSuiteInformationDto, +suite_id);
        return utils_1.HttpResponse.success({
            data: info,
            message: 'Suite information created successfully',
        });
    }
    async findOne(id) {
        const suite = await this.suiteService.findOne(+id);
        return utils_1.HttpResponse.success({
            data: suite,
            message: 'Suite information retrieved successfully',
        });
    }
    async update(id, updateSuiteDto) {
        const suite = await this.suiteService.update(+id, updateSuiteDto);
        return utils_1.HttpResponse.success({
            data: suite,
            message: 'Suite information updated successfully',
        });
    }
    async remove(id) {
        const suite = await this.suiteService.remove(+id);
        return utils_1.HttpResponse.success({
            data: suite,
            message: 'Suite deleted successfully',
        });
    }
};
exports.SuiteController = SuiteController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_suite_dto_1.CreateSuiteDto, Object]),
    __metadata("design:returntype", Promise)
], SuiteController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':suite_id/create-suit-information'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('suite_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_suite_information_dto_1.CreateSuiteInformationDto, String]),
    __metadata("design:returntype", Promise)
], SuiteController.prototype, "createSuitInformation", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuiteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_suite_dto_1.UpdateSuiteDto]),
    __metadata("design:returntype", Promise)
], SuiteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuiteController.prototype, "remove", null);
exports.SuiteController = SuiteController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('suite'),
    __metadata("design:paramtypes", [suite_service_1.SuiteService])
], SuiteController);
//# sourceMappingURL=suite.controller.js.map