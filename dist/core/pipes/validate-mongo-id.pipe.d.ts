import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class ValidateMongoIdPipe implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata): string;
}
