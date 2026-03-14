import mongoose, { HydratedDocument, Types } from 'mongoose';
export type CustomerDocument = HydratedDocument<Customer>;
export declare class Customer {
    code: string;
    tableNumber: number;
    refreshToken?: string;
}
export declare const CustomerSchema: mongoose.Schema<Customer, mongoose.Model<Customer, any, any, any, mongoose.Document<unknown, any, Customer, any, {}> & Customer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Customer, mongoose.Document<unknown, {}, mongoose.FlatRecord<Customer>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<Customer> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
