import { Category } from 'domains/categories/schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto';
export declare class CategoriesService {
    private readonly categoryModel;
    constructor(categoryModel: Model<Category>);
    create(createCategoryDto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(qs: PaginationQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalDocuments: number;
        };
    }>;
    findOne(id: number): string;
    update(id: number, updateCategoryDto: UpdateCategoryDto): string;
    remove(id: number): string;
}
