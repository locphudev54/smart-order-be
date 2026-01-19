import { OrderStatus } from 'core/constants/enum';
export declare class AccountQueryDto {
    sort?: string | undefined;
    code?: string | undefined;
    customerCode?: string | undefined;
    status?: OrderStatus | undefined;
}
