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
exports.OrderQueryDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enum_1 = require("../../../core/constants/enum");
const is_unique_array_decorator_1 = require("../../../core/decorators/is-unique-array.decorator");
const mongoose_1 = require("mongoose");
class OrderQueryDto {
}
exports.OrderQueryDto = OrderQueryDto;
__decorate([
    (0, class_validator_1.MinLength)(5, { message: 'sort phải có ít nhất 5 ký tự' }),
    (0, class_validator_1.IsString)({ message: 'sort phải là định dạng chuỗi' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.MinLength)(1, { message: 'code phải có ít nhất 1 ký tự' }),
    (0, class_validator_1.IsString)({ message: 'code phải là định dạng chuỗi' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_transformer_1.Transform)(({ value }) => String(value).trim()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.MinLength)(1, { message: 'customerCode phải có ít nhất 1 ký tự' }),
    (0, class_validator_1.IsString)({ message: 'customerCode phải là định dạng chuỗi' }),
    (0, class_transformer_1.Transform)(({ value }) => String(value).trim()),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderQueryDto.prototype, "customerCode", void 0);
__decorate([
    (0, is_unique_array_decorator_1.IsUniqueArray)('Các phần tử trong status không được trùng lặp'),
    (0, class_validator_1.IsEnum)(enum_1.OrderStatus, {
        each: true,
        message: `status phải là một trong những giá trị sau: ${Object.values(enum_1.OrderStatus).join(' || ')} và được ngăn cách bằng dấu ,`
    }),
    (0, class_transformer_1.Transform)(({ value }) => value.split(',').map((v) => v.trim())),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], OrderQueryDto.prototype, "status", void 0);
__decorate([
    (0, is_unique_array_decorator_1.IsUniqueArray)('Các phần tử trong tableNumber không được trùng lặp'),
    (0, class_validator_1.IsPositive)({ each: true, message: 'tableNumber phải chứa các số bàn > 0' }),
    (0, class_validator_1.IsInt)({
        each: true,
        message: `tableNumber phải là chuỗi gồm các số nguyên và được ngăn cách bằng dấu ,`
    }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'tableNumber phải có ít nhất một số bàn' }),
    (0, class_transformer_1.Transform)(({ value }) => value
        .split(',')
        .filter((v) => Boolean(v) && v.trim().length > 0)
        .map((v) => Number(v))),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], OrderQueryDto.prototype, "tableNumber", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'customerId phải là định dạng ObjectId' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], OrderQueryDto.prototype, "customerId", void 0);
//# sourceMappingURL=order-query.dto.js.map