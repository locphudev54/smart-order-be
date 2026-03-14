import { DishStatus } from 'core/constants/enum';
import { CategoryDocument } from 'domains/categories/schemas/category.schema';
import mongoose, { HydratedDocument } from 'mongoose';
export type DishDocument = HydratedDocument<Dish>;
export declare class Dish {
    title: string;
    description: string;
    price: number;
    status: DishStatus;
    category: CategoryDocument;
    cookingTime: number;
    imageUrl: string;
}
export declare const DishSchema: mongoose.Schema<Dish, mongoose.Model<Dish, any, any, any, mongoose.Document<unknown, any, Dish, any, {}> & Dish & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Dish, mongoose.Document<unknown, {}, mongoose.FlatRecord<Dish>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<Dish> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
