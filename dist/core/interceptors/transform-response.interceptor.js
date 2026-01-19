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
exports.TransformResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const response_message_decorator_1 = require("../decorators/response-message.decorator");
const rxjs_1 = require("rxjs");
let TransformResponseInterceptor = class TransformResponseInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const responseMessage = this.reflector.getAllAndOverride(response_message_decorator_1.RESPONSE_MESSAGE, [
            context.getHandler(),
            context.getClass()
        ]);
        const { statusCode } = context.switchToHttp().getResponse();
        return next.handle().pipe((0, rxjs_1.map)((response) => {
            if (!response) {
                return {
                    statusCode,
                    message: 'Không có dữ liệu trả về',
                    data: []
                };
            }
            if (response.data && response.meta) {
                return {
                    statusCode,
                    message: responseMessage ?? 'Gọi API thành công',
                    data: response.data,
                    meta: response.meta
                };
            }
            return { statusCode, message: responseMessage ?? 'Gọi API thành công', data: response };
        }));
    }
};
exports.TransformResponseInterceptor = TransformResponseInterceptor;
exports.TransformResponseInterceptor = TransformResponseInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], TransformResponseInterceptor);
//# sourceMappingURL=transform-response.interceptor.js.map