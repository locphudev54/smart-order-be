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
exports.CreateDishDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enum_1 = require("../../../core/constants/enum");
const mongoose_1 = require("mongoose");
class CreateDishDto {
}
exports.CreateDishDto = CreateDishDto;
__decorate([
    (0, class_validator_1.MaxLength)(40, { message: 'title không được vượt quá 40 kí tự' }),
    (0, class_validator_1.MinLength)(2, { message: 'title phải có ít nhất 2 kí tự' }),
    (0, class_validator_1.IsString)({ message: 'title phải là kiểu dữ liệu là string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'title không được  bỏ trống' }),
    (0, class_transformer_1.Transform)(({ value }) => String(value).trim()),
    __metadata("design:type", String)
], CreateDishDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(300, { message: 'title không được vượt quá 300 kí tự' }),
    (0, class_validator_1.IsString)({ message: 'description phải là kiểu dữ liệu là string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'description không được  bỏ trống' }),
    (0, class_transformer_1.Transform)(({ value }) => String(value).trim()),
    __metadata("design:type", String)
], CreateDishDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.Min)(1, { message: 'price phải > 0' }),
    (0, class_validator_1.IsNumber)({ allowNaN: false }, { message: 'price phải là định dạng số' }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNotEmpty)({ message: 'price không được bỏ trống' }),
    __metadata("design:type", Number)
], CreateDishDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.DishStatus, {
        message: `status phải là một trong những giá trị sau: ${Object.values(enum_1.DishStatus).join(' || ')}`
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDishDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'category phải là định dạng ObjectId' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'category không được bỏ trống' }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateDishDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.Max)(60 * 3, { message: 'cookingTime phải <= 180 phút' }),
    (0, class_validator_1.Min)(1, { message: 'cookingTime phải > 0' }),
    (0, class_validator_1.IsNumber)({ allowNaN: false }, { message: 'cookingTime phải là định dạng số' }),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    (0, class_validator_1.IsNotEmpty)({ message: 'cookingTime không được bỏ trống' }),
    __metadata("design:type", Number)
], CreateDishDto.prototype, "cookingTime", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'imageUrl phải là kiểu dữ liệu là string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => String(value).trim()),
    __metadata("design:type", String)
], CreateDishDto.prototype, "imageUrl", void 0);
//# sourceMappingURL=create-dish.dto.js.map