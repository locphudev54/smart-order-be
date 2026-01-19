"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateDateRange = void 0;
const common_1 = require("@nestjs/common");
const errors_exception_1 = require("../exceptions/errors.exception");
const date_fns_1 = require("date-fns");
let ValidateDateRange = class ValidateDateRange {
    transform(value, metadata) {
        if (!value.from || !value.to) {
            return {
                from: undefined,
                to: undefined
            };
        }
        const fromDate = new Date(value.from);
        const toDate = new Date(value.to);
        if (!(0, date_fns_1.isValid)(fromDate)) {
            throw new errors_exception_1.UnprocessableEntityError([{ field: 'from', message: 'from có giá trị Date không hợp lệ' }], 'Giá trị ngày lọc không hợp lệ');
        }
        if (!(0, date_fns_1.isValid)(toDate)) {
            throw new errors_exception_1.UnprocessableEntityError([{ field: 'to', message: 'to có giá trị Date không hợp lệ' }], 'Giá trị ngày lọc không hợp lệ');
        }
        if ((0, date_fns_1.isAfter)(fromDate, toDate)) {
            throw new errors_exception_1.UnprocessableEntityError([
                { field: 'from', message: 'from phải nhỏ hơn to' },
                { field: 'to', message: 'to phải lớn hơn from' }
            ], 'Giá trị ngày lọc không hợp lệ');
        }
        return {
            from: (0, date_fns_1.startOfDay)(fromDate),
            to: (0, date_fns_1.endOfDay)(toDate)
        };
    }
};
exports.ValidateDateRange = ValidateDateRange;
exports.ValidateDateRange = ValidateDateRange = __decorate([
    (0, common_1.Injectable)()
], ValidateDateRange);
//# sourceMappingURL=validate-date-range.pipe.js.map