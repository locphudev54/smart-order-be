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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const enum_1 = require("../../core/constants/enum");
const errors_exception_1 = require("../../core/exceptions/errors.exception");
const customers_service_1 = require("../customers/customers.service");
const table_schema_1 = require("./schemas/table.schema");
const mongoose_2 = require("mongoose");
let TablesService = class TablesService {
    constructor(tableModel, customersService, jwtService, configService) {
        this.tableModel = tableModel;
        this.customersService = customersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async create(createTableDto) {
        const { number } = createTableDto;
        const tableWithNumber = await this.findByTableNumber(number);
        if (tableWithNumber) {
            throw new errors_exception_1.BadRequestError(`Bàn ăn với số hiệu ${number} đã tồn tại`);
        }
        const token = await this.signTableToken(number);
        const reservationLink = this.createReservationLink(token);
        return this.tableModel.create({ ...createTableDto, token, reservationLink });
    }
    async findAll(qs) {
        const { page, limit, sort: sortQuery, ...filter } = qs;
        const sortField = sortQuery?.split('.')?.[0];
        const sort = sortQuery?.split('.')?.[1] === 'desc' ? `-${sortField}` : sortField;
        const query = this.tableModel.find(filter).populate({ path: 'customer', select: ['_id', 'code'] });
        if (limit && page) {
            query
                .skip((page - 1) * limit)
                .limit(limit)
                .sort(sort);
        }
        const [data, totalDocuments] = await Promise.all([query, this.tableModel.countDocuments(filter)]);
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
    async findOne(id) {
        const table = await this.tableModel.findById(id);
        if (!table) {
            throw new errors_exception_1.NotFoundError('Bàn không tồn tại');
        }
        return table;
    }
    findByTableNumberList(numberList) {
        return this.tableModel.find({
            number: {
                $in: numberList
            }
        });
    }
    findByTableNumber(number) {
        return this.tableModel.findOne({ number });
    }
    findTableByToken(token) {
        return this.tableModel.findOne({ token });
    }
    async update(id, updateTableDto) {
        const { changeToken, status } = updateTableDto;
        const targetTable = await this.tableModel.findOne({ _id: id }).populate({
            path: 'customer',
            select: ['_id']
        });
        if (!targetTable) {
            throw new errors_exception_1.NotFoundError('Bàn không tồn tại');
        }
        if (updateTableDto.number) {
            const tableWithNumber = await this.findByTableNumber(targetTable.number);
            if (tableWithNumber) {
                throw new common_1.BadRequestException(`Bàn ăn với số hiệu ${targetTable.number} đã tồn tại`);
            }
        }
        if (changeToken) {
            const newTableToken = await this.signTableToken(targetTable.number);
            const reservationLink = this.createReservationLink(newTableToken);
            if (status === enum_1.TableStatus.Available && targetTable.customer !== null) {
                updateTableDto.customer = null;
                const customerId = targetTable.customer?._id;
                this.customersService.removeRefreshToken(customerId.toString());
            }
            return this.tableModel.findOneAndUpdate({ _id: id }, { ...updateTableDto, reservationLink, token: newTableToken }, { returnOriginal: false });
        }
        if (status === enum_1.TableStatus.Available && targetTable.customer !== null) {
            updateTableDto.customer = null;
            const customerId = targetTable.customer?._id;
            this.customersService.removeRefreshToken(customerId.toString());
        }
        return this.tableModel.findOneAndUpdate({ _id: id }, updateTableDto, { returnOriginal: false });
    }
    async updateByNumber(tableNumber, updateTableDto) {
        const table = await this.tableModel.findOne({ number: tableNumber });
        return this.update(table._id.toString(), updateTableDto);
    }
    async remove(id) {
        const table = await this.tableModel.findById(id);
        if (!table) {
            throw new errors_exception_1.NotFoundError('Bàn không tồn tại');
        }
        return this.tableModel.deleteOne({ _id: id });
    }
    signTableToken(tableNumber) {
        return this.jwtService.signAsync({ tableNumber }, { secret: this.configService.get('tableToken.secret') });
    }
    createReservationLink(tableToken) {
        return `${this.configService.get('client.baseUrl')}/reservation?token=${tableToken}`;
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(table_schema_1.Table.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => customers_service_1.CustomersService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        customers_service_1.CustomersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], TablesService);
//# sourceMappingURL=tables.service.js.map