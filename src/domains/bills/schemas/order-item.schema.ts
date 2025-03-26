import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

@Schema({ versionKey: false })
export class OrderItem {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Dish' })
  dish: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: Number })
  quantity: number

  @Prop({ required: true, type: Number })
  price: number

  @Prop({ required: false, type: Date, default: Date.now })
  createdAt?: string

  @Prop({ required: false, type: Date, default: Date.now })
  updatedAt?: string
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)
