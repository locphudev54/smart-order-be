import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto';
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
import { AccountType } from 'core/types/type';
import { CreateBillDto } from 'domains/bills/dtos/create-bill.dto';
import { Bill } from 'domains/bills/schemas/bill.schema';
import { OrdersService } from 'domains/orders/orders.service';
import { Model } from 'mongoose';
export declare class BillsService {
    private readonly billModel;
    private readonly ordersService;
    constructor(billModel: Model<Bill>, ordersService: OrdersService);
    create(createBillDto: CreateBillDto, account: AccountType): Promise<import("mongoose").Document<unknown, {}, Bill, {}> & Bill & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(qs: PaginationQueryDto & DateRangeQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, Bill, {}> & Bill & {
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
    findOne(id: number): string;
}
