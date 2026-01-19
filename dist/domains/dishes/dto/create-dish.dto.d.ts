import { DishStatus } from 'core/constants/enum';
import { Types } from 'mongoose';
export declare class CreateDishDto {
    title: string;
    description: string;
    price: number;
    status?: DishStatus;
    category: Types.ObjectId;
    cookingTime: number;
    imageUrl?: string;
}
