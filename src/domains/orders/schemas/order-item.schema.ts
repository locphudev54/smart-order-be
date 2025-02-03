import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Types } from 'mongoose'

@Schema()
export class OrderItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' })
  dishId: Types.ObjectId

  @Prop()
  quantity: number

  @Prop()
  price: number

  @Prop({ required: true })
  note: string
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)
