import { OrderStatus } from 'core/constants/enum';
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto';
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
import { AccountType } from 'core/types/type';
import { BillsService } from 'domains/bills/bills.service';
import { CustomersService } from 'domains/customers/customers.service';
import { DeleteBulkDto } from 'domains/orders/dto/delete-bulk.dto';
import { OrderQueryDto } from 'domains/orders/dto/order-query.dto';
import { OrdersGateway } from 'domains/orders/orders.gateway';
import { Order } from 'domains/orders/schemas/order.schema';
import { TablesService } from 'domains/tables/tables.service';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DishesService } from 'domains/dishes/dishes.service';
export declare class OrdersService {
    private orderModel;
    private readonly customersService;
    private readonly billsService;
    private readonly tablesService;
    private readonly ordersGateway;
    private readonly dishesService;
    constructor(orderModel: Model<Order>, customersService: CustomersService, billsService: BillsService, tablesService: TablesService, ordersGateway: OrdersGateway, dishesService: DishesService);
    create(createOrderDto: CreateOrderDto, fromCustomer?: boolean): Promise<(import("mongoose").Document<unknown, {}, Order, {}, {}> & Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findAll(qs: PaginationQueryDto & DateRangeQueryDto & OrderQueryDto, account?: AccountType | undefined): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalDocuments: number;
        };
    }>;
    getStatisticsByTables(): Promise<{
        tableNumber: number;
        orders: Order[];
        statusCounts: Record<OrderStatus, number>;
    }[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Order, {}, {}> & Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    canTransitionStatus(current: OrderStatus, next: OrderStatus): boolean;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("mongoose").Document<unknown, {}, Order, {}, {}> & Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
    removeBulk({ ids }: DeleteBulkDto): Promise<import("mongodb").DeleteResult>;
    checkout(customerId: string, account: AccountType): Promise<import("mongoose").Document<unknown, {}, import("../bills/schemas/bill.schema").Bill, {}, {}> & import("../bills/schemas/bill.schema").Bill & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
}
