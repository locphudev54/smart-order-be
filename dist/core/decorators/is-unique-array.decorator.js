"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUniqueArray = IsUniqueArray;
const class_validator_1 = require("class-validator");
const is_unique_array_validator_1 = require("../validators/is-unique-array.validator");
function IsUniqueArray(message, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: { message, ...validationOptions },
            constraints: [message],
            validator: is_unique_array_validator_1.IsUniqueArrayConstraint
        });
    };
}
//# sourceMappingURL=is-unique-array.decorator.js.map