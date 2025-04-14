import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DishStatus } from 'core/constants/enum'
import { CategoryDocument } from 'domains/categories/schemas/category.schema'
import mongoose, { HydratedDocument } from 'mongoose'

export type DishDocument = HydratedDocument<Dish>

@Schema({ timestamps: true, versionKey: false, collection: 'Dishes' })
export class Dish {
  @Prop({ required: true, type: String })
  title: string

  @Prop({ required: false, type: String, default: '' })
  description: string

  @Prop({ required: true, type: Number })
  price: number

  @Prop({ required: false, type: String, enum: DishStatus, default: DishStatus.Available })
  status: DishStatus

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: CategoryDocument

  @Prop({ required: true, type: Number })
  cookingTime: number // minutes

  @Prop({ required: false, type: String, default: '' })
  imageUrl: string
}

export const DishSchema = SchemaFactory.createForClass(Dish)

DishSchema.index({ title: 'text', description: 'text' })
