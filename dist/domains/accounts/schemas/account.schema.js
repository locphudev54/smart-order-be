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
exports.AccountSchema = exports.Account = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const enum_1 = require("../../../core/constants/enum");
let Account = class Account {
};
exports.Account = Account;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true, unique: true, type: String }),
    __metadata("design:type", String)
], Account.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], Account.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], Account.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: '', type: String }),
    __metadata("design:type", String)
], Account.prototype, "avatarUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: String, enum: enum_1.Role, default: enum_1.Role.Waiter }),
    __metadata("design:type", String)
], Account.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: String, default: '' }),
    __metadata("design:type", String)
], Account.prototype, "refreshToken", void 0);
exports.Account = Account = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false, collection: 'Accounts' })
], Account);
exports.AccountSchema = mongoose_1.SchemaFactory.createForClass(Account);
//# sourceMappingURL=account.schema.js.map