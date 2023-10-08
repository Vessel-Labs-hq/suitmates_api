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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const utils_1 = require("../../utils");
const auth_guard_1 = require("../../guards/auth.guard");
const aws_s3_service_1 = require("../../aws/aws-s3.service");
const decorators_1 = require("../../decorators");
let UserController = class UserController {
    constructor(userService, awsS3Service) {
        this.userService = userService;
        this.awsS3Service = awsS3Service;
    }
    async create(createUserDto) {
        const user = await this.userService.register(createUserDto);
        return utils_1.HttpResponse.success({
            data: user,
            message: 'User created successfully',
        });
    }
    async findAll() {
        const users = await this.userService.findAll();
        return utils_1.HttpResponse.success({
            data: users,
            message: 'Users record retrieved successfully',
        });
    }
    async findOne(id) {
        const user = await this.userService.findOne(+id);
        return utils_1.HttpResponse.success({
            data: user,
            message: 'User record retrieved successfully',
        });
    }
    async update(id, updateUserDto, avatar) {
        const avatarLink = await this.awsS3Service.uploadFile(avatar.originalname, avatar.buffer);
        updateUserDto.avatar = avatarLink;
        const user = await this.userService.update(+id, updateUserDto);
        return utils_1.HttpResponse.success({
            data: user,
            message: 'User updated successfully',
        });
    }
    async remove(id) {
        const user = await this.userService.remove(+id);
        return utils_1.HttpResponse.success({
            data: user,
            message: 'User created successfully',
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.ValidatedImage)('avatar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        aws_s3_service_1.AwsS3Service])
], UserController);
//# sourceMappingURL=user.controller.js.map