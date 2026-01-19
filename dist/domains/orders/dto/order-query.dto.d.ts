import { OrderStatus } from 'core/constants/enum';
import { Types } from 'mongoose';
export declare class OrderQueryDto {
    sort?: string | undefined;
    code?: string | undefined;
    customerCode?: string | undefined;
    status?: OrderStatus[] | undefined;
    tableNumber?: number[] | undefined;
    customerId?: Types.ObjectId | undefined;
}
