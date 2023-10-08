"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = void 0;
class HttpResponse {
    static success(payload) {
        return {
            success: true,
            data: payload.data,
            message: payload.message,
        };
    }
    static badRequest(data) {
        return {
            success: false,
            data: data.data,
            message: data.message,
        };
    }
}
exports.HttpResponse = HttpResponse;
//# sourceMappingURL=http-response.utils.js.map