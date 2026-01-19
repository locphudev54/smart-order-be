"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateMongoIdPipe = void 0;
const common_1 = require("@nestjs/common");
const errors_exception_1 = require("../exceptions/errors.exception");
const mongodb_1 = require("mongodb");
let ValidateMongoIdPipe = class ValidateMongoIdPipe {
    transform(value, metadata) {
        if (mongodb_1.ObjectId.isValid(value)) {
            if (String(new mongodb_1.ObjectId(value)) === value) {
                return value;
            }
            throw new errors_exception_1.BadRequestError('Path Param của route này phải là định dạng ObjectId');
        }
        throw new errors_exception_1.BadRequestError('Path Param của route này phải là định dạng ObjectId');
    }
};
exports.ValidateMongoIdPipe = ValidateMongoIdPipe;
exports.ValidateMongoIdPipe = ValidateMongoIdPipe = __decorate([
    (0, common_1.Injectable)()
], ValidateMongoIdPipe);
//# sourceMappingURL=validate-mongo-id.pipe.js.map