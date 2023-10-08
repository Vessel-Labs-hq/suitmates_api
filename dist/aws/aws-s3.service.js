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
exports.AwsS3Service = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const config_1 = require("../base/config");
let AwsS3Service = class AwsS3Service {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: config_1.AWS_ACCESS_KEY_ID,
            secretAccessKey: config_1.AWS_SECRET_ACCESS_KEY,
            region: config_1.AWS_REGION,
        });
        this.bucketName = 'suite-mate';
    }
    async uploadFile(key, body) {
        try {
            const uploadResult = await this.s3
                .upload({
                Bucket: this.bucketName,
                Key: key,
                Body: body,
            })
                .promise();
            return uploadResult.Location;
        }
        catch (error) {
            throw new Error('Failed to upload file to AWS S3.' + error);
        }
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map