import { TableStatus } from 'core/constants/enum';
import { CustomerDocument } from 'domains/customers/schemas/customer.schema';
import mongoose, { HydratedDocument, Types } from 'mongoose';
export type TableDocument = HydratedDocument<Table>;
export declare class Table {
    number: number;
    status: TableStatus;
    customer: CustomerDocument;
    reservationLink: string;
    token: string;
}
export declare const TableSchema: mongoose.Schema<Table, mongoose.Model<Table, any, any, any, mongoose.Document<unknown, any, Table, any, {}> & Table & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Table, mongoose.Document<unknown, {}, mongoose.FlatRecord<Table>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<Table> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
