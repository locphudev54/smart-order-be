import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export default class AnyExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
