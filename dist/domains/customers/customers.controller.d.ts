import { CustomersService } from './customers.service';
import { CustomerType } from 'core/types/type';
import { RefreshTokenDto } from 'domains/customers/dto/refresh-token.dto';
import { CreateOrderByCustomerDto } from 'domains/customers/dto/create-order-by-customer.dto';
import { LogoutDto } from 'domains/customers/dto/logout.dto';
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto';
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    createOrder(createOrderDto: CreateOrderByCustomerDto, customer: CustomerType): Promise<(import("mongoose").Document<unknown, {}, import("../orders/schemas/order.schema").Order, {}> & import("../orders/schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getOrders(customer: CustomerType): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalDocuments: number;
        };
    }>;
    me(customer: CustomerType): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/customer.schema").Customer, {}> & import("./schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}> & import("mongoose").Document<unknown, {}, import("./schemas/customer.schema").Customer, {}> & import("./schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(paginationQuery: PaginationQueryDto, dateRangeQuery: DateRangeQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/customer.schema").Customer, {}> & import("./schemas/customer.schema").Customer & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}> & import("mongoose").Document<unknown, {}, import("./schemas/customer.schema").Customer, {}> & import("./schemas/customer.schema").Customer & {
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
    login(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        customer: CustomerType;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        account: {
            _id: string;
            name: string;
            tableNumber: number;
            code: string;
        };
    }>;
    logout(logoutDto: LogoutDto): Promise<void>;
}
