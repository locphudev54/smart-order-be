"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderByCustomerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_order_dto_1 = require("../../orders/dto/create-order.dto");
class CreateOrderByCustomerDto extends (0, mapped_types_1.OmitType)(create_order_dto_1.CreateOrderDto, ['tableNumber']) {
}
exports.CreateOrderByCustomerDto = CreateOrderByCustomerDto;
//# sourceMappingURL=create-order-by-customer.dto.js.map