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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const public_decorator_1 = require("../../core/decorators/public.decorator");
const response_message_decorator_1 = require("../../core/decorators/response-message.decorator");
const local_customer_auth_guard_1 = require("../../core/guards/local-customer-auth.guard");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const customer_decorator_1 = require("../../core/decorators/customer.decorator");
const customer_route_decorator_1 = require("../../core/decorators/customer-route.decorator");
const jwt_customer_auth_guard_1 = require("../../core/guards/jwt-customer-auth.guard");
const create_order_by_customer_dto_1 = require("./dto/create-order-by-customer.dto");
const logout_dto_1 = require("./dto/logout.dto");
const validate_date_range_pipe_1 = require("../../core/pipes/validate-date-range.pipe");
const date_range_query_dto_1 = require("../../core/query-string-dtos/date-range-query.dto");
const pagination_query_dto_1 = require("../../core/query-string-dtos/pagination-query.dto");
let CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    createOrder(createOrderDto, customer) {
        return this.customersService.createOrder(createOrderDto, customer);
    }
    getOrders(customer) {
        return this.customersService.findOrders(customer);
    }
    me(customer) {
        return this.customersService.findOne(customer._id);
    }
    findAll(paginationQuery, dateRangeQuery) {
        return this.customersService.findAll({ ...paginationQuery, ...dateRangeQuery });
    }
    login(req) {
        return this.customersService.login(req.user);
    }
    refreshToken(refreshTokenDto) {
        return this.customersService.refreshToken(refreshTokenDto);
    }
    logout(logoutDto) {
        return this.customersService.logout(logoutDto);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, customer_route_decorator_1.CustomerRoute)(),
    (0, common_1.UseGuards)(jwt_customer_auth_guard_1.JwtCustomerAuthGuard),
    (0, common_1.Post)('orders'),
    (0, response_message_decorator_1.ResponseMessage)('Tạo đơn hàng thành công'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, customer_decorator_1.Customer)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_by_customer_dto_1.CreateOrderByCustomerDto, Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "createOrder", null);
__decorate([
    (0, customer_route_decorator_1.CustomerRoute)(),
    (0, common_1.UseGuards)(jwt_customer_auth_guard_1.JwtCustomerAuthGuard),
    (0, common_1.Get)('orders'),
    (0, response_message_decorator_1.ResponseMessage)('Lấy danh sách đơn hàng thành công'),
    __param(0, (0, customer_decorator_1.Customer)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getOrders", null);
__decorate([
    (0, customer_route_decorator_1.CustomerRoute)(),
    (0, common_1.UseGuards)(jwt_customer_auth_guard_1.JwtCustomerAuthGuard),
    (0, common_1.Get)('me'),
    (0, response_message_decorator_1.ResponseMessage)('Lấy thông tin khách hàng thành công'),
    __param(0, (0, customer_decorator_1.Customer)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "me", null);
__decorate([
    (0, common_1.Get)(),
    (0, response_message_decorator_1.ResponseMessage)('Lấy danh sách khách hàng thành công'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)(validate_date_range_pipe_1.ValidateDateRange)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto, date_range_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(local_customer_auth_guard_1.LocalCustomerAuthGuard),
    (0, common_1.Post)('auth/login'),
    (0, response_message_decorator_1.ResponseMessage)('Đăng nhập thành công'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('auth/refresh-token'),
    (0, response_message_decorator_1.ResponseMessage)('Cập nhật Refresh Token thành công'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "refreshToken", null);
__decorate([
    (0, customer_route_decorator_1.CustomerRoute)(),
    (0, common_1.Post)('auth/logout'),
    (0, response_message_decorator_1.ResponseMessage)('Đăng xuất thành công'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logout_dto_1.LogoutDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "logout", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map