"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    employeeAccessToken: {
        secret: process.env.EMPLOYEE_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.EMPLOYEE_ACCESS_TOKEN_EXPIRATION_TIME
    },
    employeeRefreshToken: {
        secret: process.env.EMPLOYEE_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.EMPLOYEE_REFRESH_TOKEN_EXPIRATION_TIME
    },
    tableToken: {
        secret: process.env.TABLE_TOKEN_SECRET
    },
    customerAccessToken: {
        secret: process.env.CUSTOMER_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.CUSTOMER_ACCESS_TOKEN_EXPIRATION_TIME
    },
    customerRefreshToken: {
        secret: process.env.CUSTOMER_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME
    }
});
//# sourceMappingURL=token.js.map