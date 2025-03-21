import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DishStatus } from 'core/constants/enum'
import { HydratedDocument } from 'mongoose'

export type DishDocument = HydratedDocument<Dish>

@Schema({ timestamps: true, versionKey: false, collection: 'Dishes' })
export class Dish {
  @Prop({ required: true, type: String })
  title: string

  @Prop({ required: true, type: String })
  description: string

  @Prop({ required: true, type: Number })
  price: number

  @Prop({ required: false, type: String, enum: DishStatus, default: DishStatus.Available })
  status: DishStatus

  @Prop({ required: false, type: String, default: '' })
  imageUrl: string
}

export const DishSchema = SchemaFactory.createForClass(Dish)
