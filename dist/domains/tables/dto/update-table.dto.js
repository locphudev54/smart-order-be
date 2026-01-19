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
exports.UpdateTableDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const errors_exception_1 = require("../../../core/exceptions/errors.exception");
const mongoose_1 = require("mongoose");
const create_table_dto_1 = require("./create-table.dto");
class UpdateTableDto extends (0, mapped_types_1.PartialType)(create_table_dto_1.CreateTableDto) {
}
exports.UpdateTableDto = UpdateTableDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (+value === 1)
            return true;
        if (+value === 0)
            return false;
        throw new errors_exception_1.UnprocessableEntityError([
            { field: 'changeToken', message: 'changeToken phải có kiểu dữ liệu dạng số: 1 (đổi tableToken) || 0 (ngược lại)' }
        ]);
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateTableDto.prototype, "changeToken", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'customer phải là định dạng ObjectId' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], UpdateTableDto.prototype, "customer", void 0);
//# sourceMappingURL=update-table.dto.js.map