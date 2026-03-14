import { OrderStatus } from 'core/constants/enum';
import { CustomerDocument } from 'domains/customers/schemas/customer.schema';
import { DishDocument } from 'domains/dishes/schemas/dish.schema';
import mongoose from 'mongoose';
export type OrderDocument = mongoose.HydratedDocument<Order>;
export declare class Order {
    customer: CustomerDocument;
    code: string;
    dish: DishDocument;
    price: number;
    quantity: number;
    totalPrice: number;
    note: string;
    status?: OrderStatus;
    tableNumber: number;
    paidAt: Date;
    cookingCompletedAt: Date;
}
export declare const OrderSchema: mongoose.Schema<Order, mongoose.Model<Order, any, any, any, mongoose.Document<unknown, any, Order, any, {}> & Order & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Order, mongoose.Document<unknown, {}, mongoose.FlatRecord<Order>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<Order> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
