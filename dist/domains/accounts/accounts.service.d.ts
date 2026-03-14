import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
import { AccountQueryDto } from 'domains/accounts/dto/account-query.dto';
import { Account, AccountDocument } from 'domains/accounts/schemas/account.schema';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ConfigService } from '@nestjs/config';
export declare class AccountsService {
    private accountModel;
    private readonly configService;
    private saltRounds;
    constructor(accountModel: Model<AccountDocument>, configService: ConfigService);
    create(createAccountDto: CreateAccountDto & {
        _id?: string;
    }): Promise<{
        _id: import("mongoose").Types.ObjectId;
        email: string;
        fullName: string;
        avatarUrl: string;
        role: import("../../core/constants/enum").Role;
    }>;
    findAll(qs: PaginationQueryDto & AccountQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalDocuments: number;
        };
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findByEmail(email: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {}>;
    findByRefreshToken(refreshToken: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {}>;
    findAccountByEmailAndPassword({ email, password }: {
        email: string;
        password: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Account, {}, {}> & Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateAccountDto: UpdateAccountDto): Promise<import("mongoose").UpdateWriteOpResult>;
    updateRefreshToken(id: string, refreshToken: string): Promise<import("mongoose").UpdateWriteOpResult>;
    updatePassword(id: string, password: string): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    decryptPassword(encryptedPassword: string): string | null;
}
