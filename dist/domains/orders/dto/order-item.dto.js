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
exports.OrderItemDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
class OrderItemDto {
}
exports.OrderItemDto = OrderItemDto;
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'dish phải là định dạng ObjectId' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'dish không được bỏ trống' }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], OrderItemDto.prototype, "dish", void 0);
__decorate([
    (0, class_validator_1.Min)(1, { message: 'quantity phải > 0' }),
    (0, class_validator_1.IsInt)({ message: 'quantity phải là định dạng số nguyên' }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNotEmpty)({ message: 'quantity không được bỏ trống' }),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.Min)(1, { message: 'price phải > 0' }),
    (0, class_validator_1.IsNumber)({ allowNaN: false }, { message: 'price phải là định dạng số' }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNotEmpty)({ message: 'price không được bỏ trống' }),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(40, { message: 'note không được vượt quá 40 kí tự' }),
    (0, class_validator_1.IsString)({ message: 'note phải là kiểu dữ liệu là string' }),
    (0, class_transformer_1.Transform)(({ value }) => String(value).trim()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "note", void 0);
//# sourceMappingURL=order-item.dto.js.map