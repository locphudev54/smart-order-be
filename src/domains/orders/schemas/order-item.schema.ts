import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Types } from 'mongoose'

@Schema()
export class OrderItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' })
  dishId: Types.ObjectId
  // dishId: Dish;

  @Prop()
  quantity: number
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)
