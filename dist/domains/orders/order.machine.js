"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusFSM = void 0;
const enum_1 = require("../../core/constants/enum");
exports.orderStatusFSM = {
    [enum_1.OrderStatus.Pending]: [enum_1.OrderStatus.Confirmed, enum_1.OrderStatus.Canceled, enum_1.OrderStatus.Rejected],
    [enum_1.OrderStatus.Confirmed]: [enum_1.OrderStatus.Cooked, enum_1.OrderStatus.Canceled],
    [enum_1.OrderStatus.Cooked]: [enum_1.OrderStatus.Served, enum_1.OrderStatus.Canceled],
    [enum_1.OrderStatus.Served]: [enum_1.OrderStatus.Paid],
    [enum_1.OrderStatus.Paid]: [],
    [enum_1.OrderStatus.Canceled]: [],
    [enum_1.OrderStatus.Rejected]: []
};
//# sourceMappingURL=order.machine.js.map