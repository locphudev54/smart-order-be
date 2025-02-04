import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DishStatus } from 'core/constants/enum'
import { HydratedDocument } from 'mongoose'

export type DishDocument = HydratedDocument<Dish>

@Schema({ timestamps: true, versionKey: false, collection: 'Dishes' })
export class Dish {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  price: number

  @Prop({ type: String, enum: DishStatus, default: DishStatus.Available })
  status: DishStatus

  @Prop({ default: '' })
  imageUrl?: string
}

export const DishSchema = SchemaFactory.createForClass(Dish)
