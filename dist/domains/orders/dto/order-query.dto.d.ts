import { OrderStatus } from 'core/constants/enum';
export declare class OrderQueryDto {
    sort?: string | undefined;
    code?: string | undefined;
    customerCode?: string | undefined;
    status?: OrderStatus[] | undefined;
    tableNumber?: number[] | undefined;
    customerId?: string | undefined;
}
