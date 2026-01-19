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
exports.CreateOrderDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const order_item_dto_1 = require("./order-item.dto");
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, class_validator_1.IsInt)({ message: 'tableNumber phải là định dạng số nguyên' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'tableNumber không được bỏ trống' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "tableNumber", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => order_item_dto_1.OrderItemDto),
    (0, class_validator_1.ValidateNested)({ each: true, message: 'Các phần tử trong items không đúng định dạng' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'items phải có ít nhất một món ăn' }),
    (0, class_validator_1.IsArray)({ message: 'items phải là định dạng mảng' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'items không được bỏ trống' }),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
//# sourceMappingURL=create-order.dto.js.map