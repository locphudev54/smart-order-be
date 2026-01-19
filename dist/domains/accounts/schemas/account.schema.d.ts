import { Role } from 'core/constants/enum';
import { HydratedDocument } from 'mongoose';
export type AccountDocument = HydratedDocument<Account>;
export declare class Account {
    email: string;
    password: string;
    fullName: string;
    avatarUrl: string;
    role: Role;
    refreshToken: string;
}
export declare const AccountSchema: import("mongoose").Schema<Account, import("mongoose").Model<Account, any, any, any, import("mongoose").Document<unknown, any, Account, any> & Account & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Account, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Account>, {}> & import("mongoose").FlatRecord<Account> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
