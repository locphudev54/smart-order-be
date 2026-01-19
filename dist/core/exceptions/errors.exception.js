"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntityError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = void 0;
const common_1 = require("@nestjs/common");
class BadRequestError extends common_1.HttpException {
    constructor(message) {
        super({
            title: 'Bad Request',
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            message
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends common_1.HttpException {
    constructor(message) {
        super({
            title: 'Not Found',
            statusCode: common_1.HttpStatus.NOT_FOUND,
            message
        }, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends common_1.HttpException {
    constructor(message) {
        super({
            title: 'Unauthorized',
            statusCode: common_1.HttpStatus.UNAUTHORIZED,
            message
        }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class UnprocessableEntityError extends common_1.HttpException {
    constructor(errors, message) {
        super({
            title: 'Unprocessable Entity',
            statusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
            message: message || 'Lỗi xác thực dữ liệu',
            errors
        }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
//# sourceMappingURL=errors.exception.js.map