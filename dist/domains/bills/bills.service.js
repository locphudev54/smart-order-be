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
exports.BillsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const enum_1 = require("../../core/constants/enum");
const utils_1 = require("../../core/utils/utils");
const bill_schema_1 = require("./schemas/bill.schema");
const orders_service_1 = require("../orders/orders.service");
const mongoose_2 = require("mongoose");
let BillsService = class BillsService {
    constructor(billModel, ordersService) {
        this.billModel = billModel;
        this.ordersService = ordersService;
    }
    async create(createBillDto, account) {
        const { customerCode } = createBillDto;
        const orderPaidQuery = await this.ordersService.findAll({ customerCode, status: [enum_1.OrderStatus.Paid] });
        if (orderPaidQuery.data.length === 0) {
            return;
        }
        let totalPrice = 0;
        const orderItems = orderPaidQuery.data.map((order) => {
            const { dish, quantity, price } = order;
            totalPrice += quantity * price;
            return {
                dish: dish._id,
                quantity,
                price
            };
        });
        const billCode = (0, utils_1.generateBillCode)();
        const { tableNumber } = orderPaidQuery.data[0];
        return this.billModel.create({
            billCode,
            orderItems,
            customerCode,
            totalPrice,
            tableNumber,
            account: account._id
        });
    }
    async findAll(qs) {
        const { page, limit, from, to } = qs;
        const filter = {};
        if (from || to) {
            filter.createdAt = {};
            if (from)
                filter.createdAt.$gte = from;
            if (to)
                filter.createdAt.$lt = to;
        }
        const query = this.billModel
            .find(filter)
            .populate([{ path: 'orderItems.dish' }, { path: 'account', select: ['fullName', 'email', 'role'] }]);
        if (limit && page) {
            query
                .skip((page - 1) * limit)
                .limit(limit)
                .sort('-createdAt');
        }
        const [data, totalDocuments] = await Promise.all([query, this.billModel.countDocuments(filter)]);
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
    findOne(id) {
        return `This action returns a #${id} invoice`;
    }
};
exports.BillsService = BillsService;
exports.BillsService = BillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bill_schema_1.Bill.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => orders_service_1.OrdersService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        orders_service_1.OrdersService])
], BillsService);
//# sourceMappingURL=bills.service.js.map