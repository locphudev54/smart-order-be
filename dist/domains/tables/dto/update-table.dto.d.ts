import { Types } from 'mongoose';
import { CreateTableDto } from './create-table.dto';
declare const UpdateTableDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTableDto>>;
export declare class UpdateTableDto extends UpdateTableDto_base {
    changeToken?: boolean;
    customer?: Types.ObjectId;
}
export {};
