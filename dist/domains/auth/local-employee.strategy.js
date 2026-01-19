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
exports.LocalEmployeeStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_local_1 = require("passport-local");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const errors_exception_1 = require("../../core/exceptions/errors.exception");
let LocalEmployeeStrategy = class LocalEmployeeStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy, 'local-employee') {
    constructor(authService) {
        super({ usernameField: 'email' });
        this.authService = authService;
    }
    async validate(email, password) {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new errors_exception_1.UnprocessableEntityError([{ message: 'Email không hợp lệ', field: 'email' }]);
        }
        if (!password || password.length < 8) {
            throw new errors_exception_1.UnprocessableEntityError([{ message: 'Mật khẩu phải có ít nhất  ký tự', field: 'password' }]);
        }
        const account = await this.authService.validateAccount(email, password.toString());
        if (!account) {
            throw new errors_exception_1.UnprocessableEntityError([{ field: 'password', message: 'Email/Password không tồn tại trên hệ thống' }]);
        }
        return {
            _id: account._id.toString(),
            avatarUrl: account.avatarUrl,
            email: account.email,
            fullName: account.fullName,
            role: account.role
        };
    }
};
exports.LocalEmployeeStrategy = LocalEmployeeStrategy;
exports.LocalEmployeeStrategy = LocalEmployeeStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], LocalEmployeeStrategy);
//# sourceMappingURL=local-employee.strategy.js.map