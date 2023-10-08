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
exports.SuiteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const utils_1 = require("../../utils");
let SuiteService = class SuiteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSuite(data, userId) {
        return this.prisma.suite.create({
            data: {
                ...data,
                user: { connect: { id: userId } }
            },
        });
    }
    async createSuiteInformation(data, suite_id) {
        const suite = await this.findOne(suite_id);
        if (suite == null || suite == undefined) {
            utils_1.ErrorHelper.BadRequestException(`No suite found`);
        }
        return this.prisma.suiteInformation.create({
            data: {
                ...data,
                suite: { connect: { id: suite.id } }
            },
        });
    }
    async findOne(id) {
        return this.prisma.suite.findFirst({
            where: {
                id
            }
        });
    }
    async update(id, updateSuiteDto) {
        return await this.prisma.suite.update({
            where: { id },
            data: updateSuiteDto,
        });
    }
    async remove(id) {
        return await this.prisma.suite.delete({ where: { id } });
    }
};
exports.SuiteService = SuiteService;
exports.SuiteService = SuiteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuiteService);
//# sourceMappingURL=suite.service.js.map