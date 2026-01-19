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
exports.LocalCustomerStrategy = void 0;
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const jwt_1 = require("@nestjs/jwt");
let LocalCustomerStrategy = class LocalCustomerStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy, 'local-customer') {
    constructor(customersService, jwtService) {
        super({ usernameField: 'tableToken', passwordField: 'tableToken' });
        this.customersService = customersService;
        this.jwtService = jwtService;
    }
    async validate(tableToken) {
        const customer = await this.customersService.validateCustomer(tableToken);
        const decodedTableToken = this.jwtService.decode(tableToken);
        return { _id: customer._id.toString(), tableNumber: decodedTableToken.tableNumber, code: customer.code };
    }
};
exports.LocalCustomerStrategy = LocalCustomerStrategy;
exports.LocalCustomerStrategy = LocalCustomerStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customers_service_1.CustomersService,
        jwt_1.JwtService])
], LocalCustomerStrategy);
//# sourceMappingURL=local-customer.strategy.js.map