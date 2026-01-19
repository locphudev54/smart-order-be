import { OrderStatus } from 'core/constants/enum';
export declare class UpdateOrderDto {
    status?: OrderStatus | undefined;
    paidAt?: Date | undefined;
    cookingCompletedAt?: Date | undefined;
}
