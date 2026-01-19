"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBillCode = exports.generateCustomerCode = exports.generateOrderCode = exports.createMediaUrl = exports.extractErrorMessageFromDto = void 0;
const nanoid_1 = require("nanoid");
const extractErrorMessageFromDto = (errors) => {
    const messages = [];
    errors.forEach((error) => {
        if (error.constraints) {
            messages.push(...Object.values(error.constraints));
        }
        if (error.children && error.children.length > 0) {
            messages.push(...(0, exports.extractErrorMessageFromDto)(error.children));
        }
    });
    return messages;
};
exports.extractErrorMessageFromDto = extractErrorMessageFromDto;
const createMediaUrl = ({ baseUrl, filename, folderName = 'tmp' }) => {
    return `${baseUrl}/public/${folderName}/${filename}`;
};
exports.createMediaUrl = createMediaUrl;
const generateOrderCode = () => {
    const nanoid = (0, nanoid_1.customAlphabet)('0123456789', 6)();
    return `ORD${nanoid}`;
};
exports.generateOrderCode = generateOrderCode;
const generateCustomerCode = () => {
    const nanoid = (0, nanoid_1.customAlphabet)('0123456789', 6)();
    return `CUS${nanoid}`;
};
exports.generateCustomerCode = generateCustomerCode;
const generateBillCode = () => {
    const nanoid = (0, nanoid_1.customAlphabet)('0123456789', 6)();
    return `BILL${nanoid}`;
};
exports.generateBillCode = generateBillCode;
//# sourceMappingURL=utils.js.map