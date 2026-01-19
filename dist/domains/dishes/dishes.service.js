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
exports.DishesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const errors_exception_1 = require("../../core/exceptions/errors.exception");
const dish_schema_1 = require("./schemas/dish.schema");
const mongoose_2 = require("mongoose");
let DishesService = class DishesService {
    constructor(dishModel) {
        this.dishModel = dishModel;
    }
    create(createDishDto) {
        return this.dishModel.create(createDishDto);
    }
    async findAll(qs) {
        const { page, limit, sort: sortQuery, keyword } = qs;
        const filter = {};
        let sort = '-createdAt';
        if (sortQuery) {
            const sortField = sortQuery.split('.')[0];
            const isDescending = sortQuery.split('.')[1] === 'desc';
            sort = isDescending ? `-${sortField}` : sortField;
        }
        if (keyword) {
            filter.$text = { $search: keyword };
        }
        const query = this.dishModel.find(filter).populate([{ path: 'category', select: ['_id', 'title'] }]);
        if (limit && page) {
            query
                .skip((page - 1) * limit)
                .limit(limit)
                .sort(sort);
        }
        const [data, totalDocuments] = await Promise.all([query, this.dishModel.countDocuments(filter)]);
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
        const dish = await this.dishModel.findById(id);
        if (!dish) {
            throw new errors_exception_1.NotFoundError('Món ăn không tồn tại');
        }
        return dish;
    }
    async update(id, updateDishDto) {
        const dish = await this.dishModel.findById(id);
        if (!dish) {
            throw new errors_exception_1.NotFoundError('Món ăn không tồn tại');
        }
        return this.dishModel.updateOne({ _id: id }, updateDishDto);
    }
    async remove(id) {
        const dish = await this.dishModel.findById(id);
        if (!dish) {
            throw new errors_exception_1.NotFoundError('Món ăn không tồn tại');
        }
        return this.dishModel.deleteOne({ _id: id });
    }
};
exports.DishesService = DishesService;
exports.DishesService = DishesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dish_schema_1.Dish.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DishesService);
//# sourceMappingURL=dishes.service.js.map