import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto';
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
import { AccountType } from 'core/types/type';
import { DeleteBulkDto } from 'domains/orders/dto/delete-bulk.dto';
import { OrderQueryDto } from 'domains/orders/dto/order-query.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findAll(paginationQuery: PaginationQueryDto, dateRangeQuery: DateRangeQueryDto, orderQuery: OrderQueryDto, account: AccountType): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalDocuments: number;
        };
    }>;
    findByTables(): Promise<{
        tableNumber: number;
        orders: import("./schemas/order.schema").Order[];
        statusCounts: Record<import("core/constants/enum").OrderStatus, number>;
    }[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    removeBulk(body: DeleteBulkDto): Promise<import("mongodb").DeleteResult>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
    checkout(customerId: string, account: AccountType): Promise<import("mongoose").Document<unknown, {}, import("../bills/schemas/bill.schema").Bill, {}, {}> & import("../bills/schemas/bill.schema").Bill & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
