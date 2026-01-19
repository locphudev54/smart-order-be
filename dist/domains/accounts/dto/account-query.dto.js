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
exports.AccountQueryDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const enum_1 = require("../../../core/constants/enum");
class AccountQueryDto {
}
exports.AccountQueryDto = AccountQueryDto;
__decorate([
    (0, class_validator_1.MinLength)(5, { message: 'sort phải có ít nhất 5 ký tự' }),
    (0, class_validator_1.IsString)({ message: 'sort phải là định dạng chuỗi' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AccountQueryDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.MinLength)(1, { message: 'code phải có ít nhất 1 ký tự' }),
    (0, class_validator_1.IsString)({ message: 'code phải là định dạng chuỗi' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AccountQueryDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.MinLength)(1, { message: 'customerCode phải có ít nhất 1 ký tự' }),
    (0, class_validator_1.IsString)({ message: 'customerCode phải là định dạng chuỗi' }),
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AccountQueryDto.prototype, "customerCode", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.OrderStatus, {
        message: `status phải là một trong những giá trị sau: ${Object.values(enum_1.OrderStatus).join(' || ')}`
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AccountQueryDto.prototype, "status", void 0);
//# sourceMappingURL=account-query.dto.js.map