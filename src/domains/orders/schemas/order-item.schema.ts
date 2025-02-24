import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OrderStatus } from 'core/constants/enum'
import mongoose, { Types } from 'mongoose'

@Schema({ versionKey: false })
export class OrderItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' })
  dish: Types.ObjectId

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  price: number

  @Prop({ default: '' })
  note: string

  @Prop({ type: Date, default: Date.now })
  createdAt?: string

  @Prop({ type: Date, default: Date.now })
  updatedAt?: string
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem)
