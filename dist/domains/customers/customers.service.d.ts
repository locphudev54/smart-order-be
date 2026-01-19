import { Customer, CustomerDocument } from 'domains/customers/schemas/customer.schema';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerType } from 'core/types/type';
import { TablesService } from 'domains/tables/tables.service';
import { RefreshTokenDto } from 'domains/customers/dto/refresh-token.dto';
import { OrdersService } from 'domains/orders/orders.service';
import { CreateOrderByCustomerDto } from 'domains/customers/dto/create-order-by-customer.dto';
import { TableDocument } from 'domains/tables/schemas/table.schema';
import { LogoutDto } from 'domains/customers/dto/logout.dto';
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto';
export declare class CustomersService {
    private customerModel;
    private readonly ordersService;
    private readonly jwtService;
    private readonly configService;
    private readonly tablesService;
    constructor(customerModel: Model<CustomerDocument>, ordersService: OrdersService, jwtService: JwtService, configService: ConfigService, tablesService: TablesService);
    create({ table }: {
        table: TableDocument;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}> & import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    createOrder(createOrderDto: CreateOrderByCustomerDto, customer: CustomerType): Promise<(import("mongoose").Document<unknown, {}, import("../orders/schemas/order.schema").Order, {}> & import("../orders/schemas/order.schema").Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findAll(qs: PaginationQueryDto & DateRangeQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}> & import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalDocuments: number;
        };
    }>;
    findOrders(customer: CustomerType): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalDocuments: number;
        };
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}> & import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findByRefreshToken(refreshToken: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}> & import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}> & import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {}>;
    findByCode(code: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}> & import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}> & import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {}>;
    removeRefreshToken(id: string): import("mongoose").Query<import("mongoose").UpdateWriteOpResult, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}> & import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "updateOne", {}>;
    validateCustomer(tableToken: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}> & import("mongoose").Document<unknown, {}, Customer, {}> & Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    login(customer: CustomerType): Promise<{
        accessToken: string;
        refreshToken: string;
        customer: CustomerType;
    }>;
    logout(logoutDto: LogoutDto): Promise<void>;
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
    signCustomerAccessToken(payload: CustomerType): Promise<string>;
    signCustomerRefreshToken(payload: CustomerType, exp?: number): Promise<string>;
    updateRefreshToken(id: string, refreshToken: string): Promise<import("mongoose").UpdateWriteOpResult>;
}
