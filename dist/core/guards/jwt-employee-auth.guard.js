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
exports.JwtEmployeeAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const authenticated_user_access_decorator_1 = require("../decorators/authenticated-user-access.decorator");
const customer_route_decorator_1 = require("../decorators/customer-route.decorator");
const public_decorator_1 = require("../decorators/public.decorator");
const errors_exception_1 = require("../exceptions/errors.exception");
let JwtEmployeeAuthGuard = class JwtEmployeeAuthGuard extends (0, passport_1.AuthGuard)('jwt-employee') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        const isCustomerRoutes = this.reflector.getAllAndOverride(customer_route_decorator_1.IS_CUSTOMER_ROUTE, [
            context.getHandler(),
            context.getClass()
        ]);
        const isAuthenticatedUserAccess = this.reflector.getAllAndOverride(authenticated_user_access_decorator_1.IS_AUTHENTICATED_USER_ACCESS, [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic || isCustomerRoutes || isAuthenticatedUserAccess) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new errors_exception_1.UnauthorizedError('ACCESS_TOKEN_REQUIRED');
        }
        return super.canActivate(context);
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    handleRequest(err, user, info) {
        if (info instanceof jwt_1.TokenExpiredError) {
            throw new errors_exception_1.UnauthorizedError('ACCESS_TOKEN_EXPIRED');
        }
        if (err || !user) {
            throw err || new errors_exception_1.UnauthorizedError('INVALID_ACCESS_TOKEN');
        }
        return user;
    }
};
exports.JwtEmployeeAuthGuard = JwtEmployeeAuthGuard;
exports.JwtEmployeeAuthGuard = JwtEmployeeAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtEmployeeAuthGuard);
//# sourceMappingURL=jwt-employee-auth.guard.js.map