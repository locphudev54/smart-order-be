import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
import { AccountType } from 'core/types/type';
import { BillsService } from 'domains/bills/bills.service';
import { CreateBillDto } from 'domains/bills/dtos/create-bill.dto';
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto';
export declare class BillsController {
    private readonly billsService;
    constructor(billsService: BillsService);
    create(createBillDto: CreateBillDto, account: AccountType): Promise<import("mongoose").Document<unknown, {}, import("./schemas/bill.schema").Bill, {}, {}> & import("./schemas/bill.schema").Bill & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(paginationQuery: PaginationQueryDto, dateRangeQuery: DateRangeQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/bill.schema").Bill, {}, {}> & import("./schemas/bill.schema").Bill & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalDocuments: number;
        };
    }>;
}
