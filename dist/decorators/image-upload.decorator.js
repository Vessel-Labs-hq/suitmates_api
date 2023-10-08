"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatedImage = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
function ValidatedImage(image) {
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)(image, {
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Only jpg, jpeg, and png files are allowed!'), false);
            }
            cb(null, true);
        },
    })));
}
exports.ValidatedImage = ValidatedImage;
//# sourceMappingURL=image-upload.decorator.js.map