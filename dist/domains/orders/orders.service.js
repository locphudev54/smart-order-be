"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const enum_1 = require("../../core/constants/enum");
const errors_exception_1 = require("../../core/exceptions/errors.exception");
const utils_1 = require("../../core/utils/utils");
const date_fns_1 = require("date-fns");
const bills_service_1 = require("../bills/bills.service");
const customers_service_1 = require("../customers/customers.service");
const orders_gateway_1 = require("./orders.gateway");
const order_schema_1 = require("./schemas/order.schema");
const tables_service_1 = require("../tables/tables.service");
const mongoose_2 = require("mongoose");
const order_machine_1 = require("./order.machine");
const dishes_service_1 = require("../dishes/dishes.service");
let OrdersService = class OrdersService {
    constructor(orderModel, customersService, billsService, tablesService, ordersGateway, dishesService) {
        this.orderModel = orderModel;
        this.customersService = customersService;
        this.billsService = billsService;
        this.tablesService = tablesService;
        this.ordersGateway = ordersGateway;
        this.dishesService = dishesService;
    }
    async create(createOrderDto, fromCustomer) {
        const { tableNumber, items } = createOrderDto;
        const table = await this.tablesService.findByTableNumber(tableNumber);
        if (!table) {
            throw new errors_exception_1.NotFoundError('Bàn không tồn tại');
        }
        const checkDishesStatusPromises = items.map(async (dishItem) => {
            const dish = await this.dishesService.findOne(dishItem.dish.toString());
            if (dish.status === enum_1.DishStatus.Unavailable) {
                throw new errors_exception_1.BadRequestError('Món ăn bạn tạo đã hết hàng');
            }
        });
        try {
            await Promise.all(checkDishesStatusPromises);
        }
        catch (error) {
            throw error;
        }
        if (table.customer) {
            const customerId = table.customer;
            const previousOrder = await this.orderModel.findOne({ customer: customerId });
            if (!previousOrder) {
                const orderCode = (0, utils_1.generateOrderCode)();
                const newOrders = await Promise.all(items.map(({ price, dish, note, quantity }) => this.orderModel.create({
                    code: orderCode,
                    customer: customerId,
                    table: table._id,
                    tableNumber: table.number,
                    dish,
                    note,
                    price,
                    quantity,
                    totalPrice: price * quantity
                })));
                if (fromCustomer) {
                    this.ordersGateway.emitNewOrderByCustomer({ tableNumber, quantity: newOrders.length });
                }
                else {
                    this.ordersGateway.emitNewOrderByEmployee(customerId.toString(), {
                        tableNumber: table.number,
                        quantity: items.length
                    });
                }
                return newOrders;
            }
            const previousOrderCode = previousOrder.code;
            const newOrders = await Promise.all(items.map(({ price, dish, note, quantity }) => this.orderModel.create({
                code: previousOrderCode,
                customer: customerId,
                table: table._id,
                tableNumber: table.number,
                dish,
                note,
                price,
                quantity,
                totalPrice: price * quantity
            })));
            if (fromCustomer) {
                this.ordersGateway.emitNewOrderByCustomer({ tableNumber, quantity: newOrders.length });
            }
            else {
                this.ordersGateway.emitNewOrderByEmployee(customerId.toString(), {
                    tableNumber: table.number,
                    quantity: items.length
                });
            }
            return newOrders;
        }
        else {
            if (fromCustomer) {
                throw new errors_exception_1.BadRequestError('Bạn không thể tiếp tục gọi món! Vui lòng đăng xuất');
            }
            const newCustomer = await this.customersService.create({ table });
            const orderCode = (0, utils_1.generateOrderCode)();
            return Promise.all(items.map(({ price, dish, note, quantity }) => this.orderModel.create({
                code: orderCode,
                customer: newCustomer._id,
                table: table._id,
                tableNumber: table.number,
                dish,
                note,
                price,
                quantity,
                totalPrice: price * quantity
            })));
        }
    }
    async findAll(qs, account) {
        const { page, limit, from, to, sort: sortQuery, customerCode, status, code, tableNumber } = qs;
        const filter = {};
        if (customerCode) {
            const customerId = (await this.customersService.findByCode(customerCode))?._id;
            filter.customer = customerId;
        }
        if (qs.customerId) {
            filter.customer = new mongoose_2.Types.ObjectId(qs.customerId);
        }
        if (status) {
            filter.status = { $in: status };
        }
        if (code) {
            filter.code = { $regex: code, $options: 'i' };
        }
        if (tableNumber) {
            filter.tableNumber = { $in: tableNumber };
        }
        let sort = { createdAt: -1 };
        if (sortQuery) {
            const sortField = sortQuery.split('.')[0];
            const isDescending = sortQuery.split('.')[1] === 'desc';
            sort = isDescending ? { [sortField]: -1 } : { [sortField]: 1 };
        }
        if (account && account.role === enum_1.Role.Chef) {
            sort = { ...sort, ['dishDoc.cookingTime']: -1 };
        }
        if (from || to) {
            filter.createdAt = {};
            if (from)
                filter.createdAt.$gte = from;
            if (to)
                filter.createdAt.$lt = to;
        }
        const pipeline = [
            { $match: filter },
            {
                $lookup: {
                    from: 'Dishes',
                    localField: 'dish',
                    foreignField: '_id',
                    as: 'dishDoc'
                }
            },
            {
                $unwind: { path: '$dishDoc', preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: 'Customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
            {
                $unwind: { path: '$customerDoc', preserveNullAndEmptyArrays: true }
            },
            {
                $sort: sort
            },
            {
                $project: {
                    _id: 1,
                    code: 1,
                    price: 1,
                    quantity: 1,
                    totalPrice: 1,
                    note: 1,
                    status: 1,
                    tableNumber: 1,
                    paidAt: 1,
                    cookingCompletedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    customer: {
                        _id: '$customerDoc._id',
                        code: '$customerDoc.code'
                    },
                    dish: '$dishDoc'
                }
            }
        ];
        const query = this.orderModel.aggregate(pipeline);
        if (limit && page) {
            query.skip((page - 1) * limit).limit(limit);
        }
        const [data, totalDocuments] = await Promise.all([query, this.orderModel.countDocuments(filter)]);
        return {
            data,
            meta: {
                page: page || 1,
                limit: limit || totalDocuments,
                totalPages: limit ? Math.ceil(totalDocuments / limit) : 1,
                totalDocuments
            }
        };
    }
    async getStatisticsByTables() {
        const tableQuery = await this.tablesService.findAll({});
        const tableNumbers = tableQuery.data.map((table) => table.number);
        const orderStatuses = Object.values(enum_1.OrderStatus);
        const from = (0, date_fns_1.startOfToday)();
        const to = (0, date_fns_1.endOfToday)();
        const orderQuery = await this.findAll({ from, to });
        const statisticsResult = tableNumbers.map((tableNumber) => ({
            tableNumber,
            orders: [],
            statusCounts: orderStatuses.reduce((acc, status) => {
                acc[status] = 0;
                return acc;
            }, {})
        }));
        const tablesHasCustomer = tableQuery.data.filter((table) => table.customer && table.status === enum_1.TableStatus.Occupied);
        const customerIds = tablesHasCustomer.map((table) => table.customer.id);
        const currentOrdersInTables = orderQuery.data.filter((order) => customerIds.includes(order.customer.id));
        currentOrdersInTables.forEach((order) => {
            statisticsResult.forEach((summary) => {
                if (summary.tableNumber === order.tableNumber) {
                    summary.statusCounts[order.status] += 1;
                    summary.orders.push(order);
                }
            });
        });
        return statisticsResult;
    }
    async findOne(id) {
        const order = await this.orderModel
            .findOne({ _id: id })
            .populate([{ path: 'customer', select: ['_id', 'code'] }, { path: 'dish' }]);
        if (!order) {
            throw new errors_exception_1.NotFoundError('Đơn hàng không tồn tại');
        }
        return order;
    }
    canTransitionStatus(current, next) {
        return order_machine_1.orderStatusFSM[current].includes(next);
    }
    async update(id, updateOrderDto) {
        const order = await this.findOne(id);
        if (!order) {
            throw new errors_exception_1.NotFoundError('Đơn hàng không tồn tại');
        }
        const currentStatus = order.status;
        const { status: nextStatus } = updateOrderDto;
        if (!this.canTransitionStatus(currentStatus, nextStatus)) {
            throw new errors_exception_1.BadRequestError(`Không thể chuyển trạng thái đơn hàng từ ${currentStatus} sang ${nextStatus}`);
        }
        const customerCode = order.customer.code;
        const dishTitle = order.dish.title;
        this.ordersGateway.emitUpdateOrder(customerCode, { dishTitle, status: nextStatus });
        const now = new Date();
        if (updateOrderDto.status === enum_1.OrderStatus.Cooked) {
            updateOrderDto.cookingCompletedAt = now;
        }
        else if (updateOrderDto.status === enum_1.OrderStatus.Paid) {
            updateOrderDto.paidAt = now;
        }
        return this.orderModel.findOneAndUpdate({
            _id: id
        }, updateOrderDto, {
            returnOriginal: false
        });
    }
    async remove(id) {
        return this.orderModel.deleteOne({ _id: id });
    }
    async removeBulk({ ids }) {
        return this.orderModel.deleteMany({ _id: ids });
    }
    async checkout(customerId, account) {
        const [customer] = await Promise.all([
            this.customersService.findOne(customerId),
            this.orderModel.updateMany({ customer: customerId, status: { $nin: [enum_1.OrderStatus.Rejected, enum_1.OrderStatus.Canceled] } }, { status: enum_1.OrderStatus.Paid }),
            this.customersService.updateRefreshToken(customerId, '')
        ]);
        const customerCode = customer.code;
        const { tableNumber } = customer;
        const [bill] = await Promise.all([
            this.billsService.create({ customerCode }, account),
            this.tablesService.updateByNumber(tableNumber, { customer: null, status: enum_1.TableStatus.Available })
        ]);
        this.ordersGateway.emitLogout(customerId);
        return bill;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => customers_service_1.CustomersService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => bills_service_1.BillsService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        customers_service_1.CustomersService,
        bills_service_1.BillsService,
        tables_service_1.TablesService,
        orders_gateway_1.OrdersGateway,
        dishes_service_1.DishesService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map