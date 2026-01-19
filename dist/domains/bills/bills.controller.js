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
exports.BillsController = void 0;
const common_1 = require("@nestjs/common");
const response_message_decorator_1 = require("../../core/decorators/response-message.decorator");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const enum_1 = require("../../core/constants/enum");
const pagination_query_dto_1 = require("../../core/query-string-dtos/pagination-query.dto");
const account_decorator_1 = require("../../core/decorators/account.decorator");
const bills_service_1 = require("./bills.service");
const create_bill_dto_1 = require("./dtos/create-bill.dto");
const date_range_query_dto_1 = require("../../core/query-string-dtos/date-range-query.dto");
const validate_date_range_pipe_1 = require("../../core/pipes/validate-date-range.pipe");
let BillsController = class BillsController {
    constructor(billsService) {
        this.billsService = billsService;
    }
    create(createBillDto, account) {
        return this.billsService.create(createBillDto, account);
    }
    findAll(paginationQuery, dateRangeQuery) {
        return this.billsService.findAll({ ...paginationQuery, ...dateRangeQuery });
    }
};
exports.BillsController = BillsController;
__decorate([
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Waiter]),
    (0, common_1.Post)(),
    (0, response_message_decorator_1.ResponseMessage)('Tạo mới phiếu tính tiền thành công'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, account_decorator_1.Account)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bill_dto_1.CreateBillDto, Object]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Waiter]),
    (0, common_1.Get)(),
    (0, response_message_decorator_1.ResponseMessage)('Lấy danh sách phiếu tính tiền thành công'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)(validate_date_range_pipe_1.ValidateDateRange)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto, date_range_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], BillsController.prototype, "findAll", null);
exports.BillsController = BillsController = __decorate([
    (0, common_1.Controller)('bills'),
    __metadata("design:paramtypes", [bills_service_1.BillsService])
], BillsController);
//# sourceMappingURL=bills.controller.js.map