import { OrderItemDto } from 'domains/orders/dto/order-item.dto';
export declare class CreateOrderDto {
    tableNumber: number;
    items: OrderItemDto[];
}
