import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
import { DishQueryDto } from 'domains/dishes/dto/dish-query.dto';
import { Dish, DishDocument } from 'domains/dishes/schemas/dish.schema';
import { Model } from 'mongoose';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
export declare class DishesService {
    private readonly dishModel;
    constructor(dishModel: Model<DishDocument>);
    create(createDishDto: CreateDishDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Dish, {}, {}> & Dish & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Dish, {}, {}> & Dish & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(qs: PaginationQueryDto & DishQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Dish, {}, {}> & Dish & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Dish, {}, {}> & Dish & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalDocuments: number;
        };
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Dish, {}, {}> & Dish & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Dish, {}, {}> & Dish & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateDishDto: UpdateDishDto): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
}
