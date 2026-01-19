import { HttpException } from '@nestjs/common';
export declare class BadRequestError extends HttpException {
    constructor(message: string);
}
export declare class NotFoundError extends HttpException {
    constructor(message: string);
}
export declare class UnauthorizedError extends HttpException {
    constructor(message: string);
}
export declare class UnprocessableEntityError extends HttpException {
    constructor(errors: {
        field: string;
        message: string;
    }[], message?: string | undefined);
}
