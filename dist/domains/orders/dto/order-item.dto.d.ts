import { Types } from 'mongoose';
export declare class OrderItemDto {
    dish: Types.ObjectId;
    quantity: number;
    price: number;
    note: string;
}
