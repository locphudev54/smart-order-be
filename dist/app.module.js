"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const casl_ability_factory_1 = require("./core/casl/casl-ability.factory");
const auth_module_1 = require("./domains/auth/auth.module");
const bills_module_1 = require("./domains/bills/bills.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_module_1 = require("./core/core.module");
const accounts_module_1 = require("./domains/accounts/accounts.module");
const categories_module_1 = require("./domains/categories/categories.module");
const cloudinary_module_1 = require("./domains/cloudinary/cloudinary.module");
const customers_module_1 = require("./domains/customers/customers.module");
const dashboard_module_1 = require("./domains/dashboard/dashboard.module");
const dishes_module_1 = require("./domains/dishes/dishes.module");
const media_module_1 = require("./domains/media/media.module");
const orders_module_1 = require("./domains/orders/orders.module");
const tables_module_1 = require("./domains/tables/tables.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            core_module_1.CoreModule,
            auth_module_1.AuthModule,
            accounts_module_1.AccountsModule,
            media_module_1.MediaModule,
            dishes_module_1.DishesModule,
            orders_module_1.OrdersModule,
            tables_module_1.TablesModule,
            customers_module_1.CustomersModule,
            cloudinary_module_1.CloudinaryModule,
            bills_module_1.BillsModule,
            dashboard_module_1.DashboardModule,
            categories_module_1.CategoriesModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, casl_ability_factory_1.CaslAbilityFactory]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map