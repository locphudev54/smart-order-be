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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const customer_schema_1 = require("./schemas/customer.schema");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const ms_1 = __importDefault(require("ms"));
const tables_service_1 = require("../tables/tables.service");
const enum_1 = require("../../core/constants/enum");
const orders_service_1 = require("../orders/orders.service");
const errors_exception_1 = require("../../core/exceptions/errors.exception");
const utils_1 = require("../../core/utils/utils");
let CustomersService = class CustomersService {
    constructor(customerModel, ordersService, jwtService, configService, tablesService) {
        this.customerModel = customerModel;
        this.ordersService = ordersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.tablesService = tablesService;
    }
    async create({ table }) {
        if (table.status !== enum_1.TableStatus.Available || table.customer) {
            throw new errors_exception_1.BadRequestError('Bàn này đã được đặt trước hoặc đang có khách sử dụng');
        }
        const customerCode = (0, utils_1.generateCustomerCode)();
        const newCustomer = await this.customerModel.create({ tableNumber: table.number, code: customerCode });
        await this.tablesService.update(table.id, { status: enum_1.TableStatus.Occupied, customer: newCustomer._id });
        return newCustomer;
    }
    createOrder(createOrderDto, customer) {
        const { items } = createOrderDto;
        return this.ordersService.create({ tableNumber: customer.tableNumber, items }, true);
    }
    async findAll(qs) {
        const { page, limit, from, to } = qs;
        const filter = {};
        if (from || to) {
            filter.createdAt = {};
            if (from)
                filter.createdAt.$gte = from;
            if (to)
                filter.createdAt.$lt = to;
        }
        const query = this.customerModel.find(filter);
        if (limit && page) {
            query
                .skip((page - 1) * limit)
                .limit(limit)
                .sort('createdAt');
        }
        const [data, totalDocuments] = await Promise.all([query, this.customerModel.countDocuments(filter)]);
        return {
            data,
            meta: {
                page: page || 1,
                limit: limit || totalDocuments,
                totalPages: limit ? Math.ceil(totalDocuments / limit) : 1,
                totalDocuments
            }
        };
    }
    async findOrders(customer) {
        return this.ordersService.findAll({ customerCode: customer.code });
    }
    async findOne(id) {
        const customer = await this.customerModel.findOne({ _id: id }).select(['-refreshToken']);
        if (!customer) {
            throw new errors_exception_1.NotFoundError('Khách hàng không tồn tại');
        }
        return customer;
    }
    findByRefreshToken(refreshToken) {
        return this.customerModel.findOne({ refreshToken });
    }
    findByCode(code) {
        return this.customerModel.findOne({ code });
    }
    removeRefreshToken(id) {
        return this.customerModel.updateOne({ _id: id }, { refreshToken: '' });
    }
    async validateCustomer(tableToken) {
        await this.jwtService
            .verifyAsync(tableToken, {
            secret: this.configService.get('tableToken.secret')
        })
            .catch(() => {
            throw new errors_exception_1.BadRequestError('Vui lòng quét lại mã QR để đặt bàn');
        });
        const table = await this.tablesService.findTableByToken(tableToken);
        if (!table) {
            throw new errors_exception_1.BadRequestError('Bàn không tồn tại');
        }
        if (table.status !== enum_1.TableStatus.Available || table.customer) {
            throw new errors_exception_1.BadRequestError('Bàn này đã được đặt trước hoặc đang có khách sử dụng');
        }
        const customerCode = (0, utils_1.generateCustomerCode)();
        const newUser = await this.customerModel.create({ tableNumber: table.number, code: customerCode });
        await this.tablesService.update(table._id.toString(), { status: enum_1.TableStatus.Occupied, customer: newUser._id });
        return newUser;
    }
    async login(customer) {
        const payload = customer;
        const [accessToken, refreshToken] = await Promise.all([
            this.signCustomerAccessToken(payload),
            this.signCustomerRefreshToken(payload)
        ]);
        await this.customerModel.updateOne({ _id: customer._id }, { refreshToken });
        return {
            accessToken,
            refreshToken,
            customer
        };
    }
    async logout(logoutDto) {
        const { refreshToken } = logoutDto;
        const customer = await this.customerModel.findOne({ refreshToken });
        if (!customer) {
            throw new errors_exception_1.BadRequestError('Refresh Token không hợp lệ');
        }
        const table = await this.tablesService.findByTableNumber(customer.tableNumber);
        const tableId = table._id.toString();
        this.customerModel.updateOne({ refreshToken }, { refreshToken: '' });
        this.tablesService.update(tableId, { status: enum_1.TableStatus.Available, customer: null });
    }
    async refreshToken(refreshTokenDto) {
        let customerId = undefined;
        try {
            const { refreshToken } = refreshTokenDto;
            const customer = await this.findByRefreshToken(refreshToken);
            if (!customer || !refreshToken) {
                throw new errors_exception_1.UnauthorizedError('INVALID_REFRESH_TOKEN');
            }
            customerId = customer._id.toString();
            const decodedOldRefreshToken = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('customerRefreshToken.secret')
            });
            const { iat, exp, ...payload } = decodedOldRefreshToken;
            const [accessToken, newRefreshToken] = await Promise.all([
                this.signCustomerAccessToken(payload),
                this.signCustomerRefreshToken(payload, decodedOldRefreshToken.exp)
            ]);
            await this.customerModel.updateOne({ _id: customer._id }, { refreshToken: newRefreshToken });
            return {
                accessToken,
                refreshToken: newRefreshToken,
                account: payload
            };
        }
        catch (error) {
            if (error instanceof jwt_1.TokenExpiredError) {
                if (customerId) {
                    this.customerModel.updateOne({ _id: customerId }, { refreshToken: '' });
                }
                throw new errors_exception_1.UnauthorizedError('REFRESH_TOKEN_EXPIRED');
            }
            throw error;
        }
    }
    signCustomerAccessToken(payload) {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('customerAccessToken.secret'),
            expiresIn: (0, ms_1.default)(this.configService.get('customerAccessToken.expiresIn')) / 1000
        });
    }
    signCustomerRefreshToken(payload, exp) {
        if (exp) {
            return this.jwtService.signAsync({ ...payload, exp }, {
                secret: this.configService.get('customerRefreshToken.secret')
            });
        }
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('customerRefreshToken.secret'),
            expiresIn: (0, ms_1.default)(this.configService.get('customerRefreshToken.expiresIn')) / 1000
        });
    }
    async updateRefreshToken(id, refreshToken) {
        return this.customerModel.updateOne({ _id: id }, { refreshToken });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => orders_service_1.OrdersService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        orders_service_1.OrdersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        tables_service_1.TablesService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map