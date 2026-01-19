"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = exports.IS_CUSTOMER_ROUTE = void 0;
const common_1 = require("@nestjs/common");
exports.IS_CUSTOMER_ROUTE = 'isCustomerRoute';
const CustomerRoute = () => (0, common_1.SetMetadata)(exports.IS_CUSTOMER_ROUTE, true);
exports.CustomerRoute = CustomerRoute;
//# sourceMappingURL=customer-route.decorator.js.map