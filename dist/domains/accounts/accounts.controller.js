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
exports.AccountsController = void 0;
const common_1 = require("@nestjs/common");
const response_message_decorator_1 = require("../../core/decorators/response-message.decorator");
const validate_mongo_id_pipe_1 = require("../../core/pipes/validate-mongo-id.pipe");
const pagination_query_dto_1 = require("../../core/query-string-dtos/pagination-query.dto");
const account_query_dto_1 = require("./dto/account-query.dto");
const accounts_service_1 = require("./accounts.service");
const create_account_dto_1 = require("./dto/create-account.dto");
const update_account_dto_1 = require("./dto/update-account.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const enum_1 = require("../../core/constants/enum");
let AccountsController = class AccountsController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    create(createAccountDto) {
        return this.accountsService.create(createAccountDto);
    }
    findAll(paginationQuery, tableQuery) {
        return this.accountsService.findAll({ ...paginationQuery, ...tableQuery });
    }
    findOne(id) {
        return this.accountsService.findOne(id);
    }
    update(id, updateAccountDto) {
        return this.accountsService.update(id, updateAccountDto);
    }
    remove(id) {
        return this.accountsService.remove(id);
    }
};
exports.AccountsController = AccountsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enum_1.Role.Manager),
    (0, response_message_decorator_1.ResponseMessage)('Tạo tài khoản thành công'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_dto_1.CreateAccountDto]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enum_1.Role.Manager),
    (0, response_message_decorator_1.ResponseMessage)('Lấy danh sách tài khoản thành công'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto, account_query_dto_1.AccountQueryDto]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(enum_1.Role.Manager),
    (0, response_message_decorator_1.ResponseMessage)('Lấy thông tin tài khoản thành công'),
    __param(0, (0, common_1.Param)('id', validate_mongo_id_pipe_1.ValidateMongoIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(enum_1.Role.Manager),
    (0, response_message_decorator_1.ResponseMessage)('Cập nhật tài khoản thành công'),
    __param(0, (0, common_1.Param)('id', validate_mongo_id_pipe_1.ValidateMongoIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_account_dto_1.UpdateAccountDto]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(enum_1.Role.Manager),
    (0, response_message_decorator_1.ResponseMessage)('Xóa tài khoản thành công'),
    __param(0, (0, common_1.Param)('id', validate_mongo_id_pipe_1.ValidateMongoIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "remove", null);
exports.AccountsController = AccountsController = __decorate([
    (0, common_1.Controller)('accounts'),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService])
], AccountsController);
//# sourceMappingURL=accounts.controller.js.map