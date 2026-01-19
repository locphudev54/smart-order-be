import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
interface IDateRangeQuery {
    from: string;
    to: string;
}
export declare class ValidateDateRange implements PipeTransform<IDateRangeQuery, {
    from: Date | undefined;
    to: Date | undefined;
}> {
    transform(value: IDateRangeQuery, metadata: ArgumentMetadata): {
        from: Date | undefined;
        to: Date | undefined;
    };
}
export {};
