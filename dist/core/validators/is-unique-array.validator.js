"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUniqueArrayConstraint = void 0;
const class_validator_1 = require("class-validator");
let IsUniqueArrayConstraint = class IsUniqueArrayConstraint {
    validate(value, args) {
        if (!Array.isArray(value))
            return false;
        return new Set(value).size === value.length;
    }
    defaultMessage(args) {
        return args.constraints[0] || `Danh sách không được chứa các giá trị trùng lặp`;
    }
};
exports.IsUniqueArrayConstraint = IsUniqueArrayConstraint;
exports.IsUniqueArrayConstraint = IsUniqueArrayConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsUniqueArray', async: false })
], IsUniqueArrayConstraint);
//# sourceMappingURL=is-unique-array.validator.js.map