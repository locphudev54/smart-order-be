import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
import { AccountQueryDto } from 'domains/accounts/dto/account-query.dto';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Role } from 'core/constants/enum';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    create(createAccountDto: CreateAccountDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        email: string;
        fullName: string;
        avatarUrl: string;
        role: Role;
    }>;
    findAll(paginationQuery: PaginationQueryDto, tableQuery: AccountQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/account.schema").Account, {}, {}> & import("./schemas/account.schema").Account & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/account.schema").Account, {}, {}> & import("./schemas/account.schema").Account & {
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
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/account.schema").Account, {}, {}> & import("./schemas/account.schema").Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/account.schema").Account, {}, {}> & import("./schemas/account.schema").Account & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateAccountDto: UpdateAccountDto): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
}
