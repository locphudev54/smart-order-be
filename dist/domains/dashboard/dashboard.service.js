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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const bills_service_1 = require("../bills/bills.service");
const customers_service_1 = require("../customers/customers.service");
const orders_service_1 = require("../orders/orders.service");
let DashboardService = class DashboardService {
    constructor(customersService, ordersService, billsService) {
        this.customersService = customersService;
        this.ordersService = ordersService;
        this.billsService = billsService;
    }
    async statistic(dateRange) {
        const [billListQuery, customerListQuery, orderListQuery] = await Promise.all([
            this.billsService.findAll(dateRange),
            this.customersService.findAll(dateRange),
            this.ordersService.findAll(dateRange)
        ]);
        const totalRevenue = billListQuery.data.reduce((result, bill) => result + bill.totalPrice, 0);
        const countCustomers = customerListQuery.meta.totalDocuments;
        const countOrders = orderListQuery.meta.totalDocuments;
        const revenueChartData = billListQuery.data.map((bill) => ({
            date: (0, date_fns_1.format)(new Date(bill.createdAt), 'yyyy-MM-dd'),
            totalPrice: bill.totalPrice
        }));
        return {
            totalRevenue,
            countCustomers,
            countOrders,
            revenueChartData
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customers_service_1.CustomersService,
        orders_service_1.OrdersService,
        bills_service_1.BillsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map