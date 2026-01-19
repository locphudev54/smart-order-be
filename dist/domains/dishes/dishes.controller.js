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
exports.DishesController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../core/decorators/public.decorator");
const response_message_decorator_1 = require("../../core/decorators/response-message.decorator");
const validate_mongo_id_pipe_1 = require("../../core/pipes/validate-mongo-id.pipe");
const pagination_query_dto_1 = require("../../core/query-string-dtos/pagination-query.dto");
const dish_query_dto_1 = require("./dto/dish-query.dto");
const dishes_service_1 = require("./dishes.service");
const create_dish_dto_1 = require("./dto/create-dish.dto");
const update_dish_dto_1 = require("./dto/update-dish.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const enum_1 = require("../../core/constants/enum");
let DishesController = class DishesController {
    constructor(dishesService) {
        this.dishesService = dishesService;
    }
    create(createDishDto) {
        return this.dishesService.create(createDishDto);
    }
    findAll(paginationQuery, tableQuery) {
        return this.dishesService.findAll({ ...paginationQuery, ...tableQuery });
    }
    findOne(id) {
        return this.dishesService.findOne(id);
    }
    update(id, updateDishDto) {
        return this.dishesService.update(id, updateDishDto);
    }
    remove(id) {
        return this.dishesService.remove(id);
    }
};
exports.DishesController = DishesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Chef]),
    (0, response_message_decorator_1.ResponseMessage)('Tạo món ăn thành công'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dish_dto_1.CreateDishDto]),
    __metadata("design:returntype", void 0)
], DishesController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, response_message_decorator_1.ResponseMessage)('Lấy danh sách món ăn thành công'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto, dish_query_dto_1.DishQueryDto]),
    __metadata("design:returntype", void 0)
], DishesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Chef]),
    (0, response_message_decorator_1.ResponseMessage)('Lấy chi tiết món ăn thành công'),
    __param(0, (0, common_1.Param)('id', validate_mongo_id_pipe_1.ValidateMongoIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DishesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Chef]),
    (0, response_message_decorator_1.ResponseMessage)('Cập nhật món ăn thành công'),
    __param(0, (0, common_1.Param)('id', validate_mongo_id_pipe_1.ValidateMongoIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dish_dto_1.UpdateDishDto]),
    __metadata("design:returntype", void 0)
], DishesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)([enum_1.Role.Manager, enum_1.Role.Chef]),
    (0, response_message_decorator_1.ResponseMessage)('Xóa món ăn thành công'),
    __param(0, (0, common_1.Param)('id', validate_mongo_id_pipe_1.ValidateMongoIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DishesController.prototype, "remove", null);
exports.DishesController = DishesController = __decorate([
    (0, common_1.Controller)('dishes'),
    __metadata("design:paramtypes", [dishes_service_1.DishesService])
], DishesController);
//# sourceMappingURL=dishes.controller.js.map