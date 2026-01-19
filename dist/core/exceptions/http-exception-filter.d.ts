import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
interface HttpErrorResponse extends HttpException {
    title: string;
    statusCode: number;
    message: string;
    errors?: {
        field: string;
        message: string;
    }[];
}
export default class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpErrorResponse, host: ArgumentsHost): void;
}
export {};
