import { OrderItem } from 'domains/bills/schemas/order-item.schema';
import mongoose from 'mongoose';
export declare class Bill {
    billCode: string;
    customerCode: string;
    totalPrice: number;
    tableNumber: number;
    orderItems: OrderItem[];
    account: mongoose.Schema.Types.ObjectId;
}
export declare const BillSchema: mongoose.Schema<Bill, mongoose.Model<Bill, any, any, any, mongoose.Document<unknown, any, Bill, any, {}> & Bill & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Bill, mongoose.Document<unknown, {}, mongoose.FlatRecord<Bill>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<Bill> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export type BillDocument = mongoose.HydratedDocument<Bill, {
    orderItems: mongoose.Types.DocumentArray<OrderItem>;
}>;
