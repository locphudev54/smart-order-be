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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const enum_1 = require("../../core/constants/enum");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const validate_date_range_pipe_1 = require("../../core/pipes/validate-date-range.pipe");
const date_range_query_dto_1 = require("../../core/query-string-dtos/date-range-query.dto");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getStatistics(dateRangeQuery) {
        return this.dashboardService.statistic(dateRangeQuery);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enum_1.Role.Manager),
    __param(0, (0, common_1.Query)(validate_date_range_pipe_1.ValidateDateRange)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [date_range_query_dto_1.DateRangeQueryDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getStatistics", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map