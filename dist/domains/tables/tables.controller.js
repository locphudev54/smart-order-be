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
exports.TablesController = void 0;
const common_1 = require("@nestjs/common");
const tables_service_1 = require("./tables.service");
const create_table_dto_1 = require("./dto/create-table.dto");
const update_table_dto_1 = require("./dto/update-table.dto");
const validate_mongo_id_pipe_1 = require("../../core/pipes/validate-mongo-id.pipe");
const pagination_query_dto_1 = require("../../core/query-string-dtos/pagination-query.dto");
const table_query_dto_1 = require("./dto/table-query.dto");
const response_message_decorator_1 = require("../../core/decorators/response-message.decorator");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const enum_1 = require("../../core/constants/enum");
let TablesController = class TablesController {
    constructor(tablesService) {
        this.tablesService = tablesService;
    }
    create(createTableDto) {
        return this.tablesService.create(createTableDto);
    }
    findAll(paginationQuery, tableQuery) {
        return this.tablesService.findAll({ ...paginationQuery, ...tableQuery });
    }
    findOne(id) {
        return this.tablesService.findOne(id);
    }
    update(id, updateTableDto) {
        return this.tablesService.update(id, updateTableDto);
    }
    remove(id) {
        return this.tablesService.remove(id);
    }
};
exports.TablesController = TablesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Waiter]),
    (0, response_message_decorator_1.ResponseMessage)('Tạo bàn mới thành công'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_table_dto_1.CreateTableDto]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, response_message_decorator_1.ResponseMessage)('Lấy danh sách bàn thành công'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto, table_query_dto_1.TableQueryDto]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Waiter]),
    (0, response_message_decorator_1.ResponseMessage)('Lấy thông tin bàn thành công'),
    __param(0, (0, common_1.Param)('id', validate_mongo_id_pipe_1.ValidateMongoIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Waiter]),
    (0, response_message_decorator_1.ResponseMessage)('Cập nhật thông tin bàn thành công'),
    __param(0, (0, common_1.Param)('id', validate_mongo_id_pipe_1.ValidateMongoIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_table_dto_1.UpdateTableDto]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Waiter]),
    (0, response_message_decorator_1.ResponseMessage)('Xóa bàn thành công'),
    __param(0, (0, common_1.Param)('id', validate_mongo_id_pipe_1.ValidateMongoIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TablesController.prototype, "remove", null);
exports.TablesController = TablesController = __decorate([
    (0, common_1.Controller)('tables'),
    __metadata("design:paramtypes", [tables_service_1.TablesService])
], TablesController);
//# sourceMappingURL=tables.controller.js.map