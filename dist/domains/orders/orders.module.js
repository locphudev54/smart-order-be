"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const customers_module_1 = require("../customers/customers.module");
const order_schema_1 = require("./schemas/order.schema");
const tables_module_1 = require("../tables/tables.module");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const orders_gateway_1 = require("./orders.gateway");
const jwt_1 = require("@nestjs/jwt");
const bills_module_1 = require("../bills/bills.module");
const dishes_module_1 = require("../dishes/dishes.module");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema }]),
            (0, common_1.forwardRef)(() => customers_module_1.CustomersModule),
            (0, common_1.forwardRef)(() => bills_module_1.BillsModule),
            tables_module_1.TablesModule,
            dishes_module_1.DishesModule
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService, jwt_1.JwtService, orders_gateway_1.OrdersGateway],
        exports: [orders_service_1.OrdersService]
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map