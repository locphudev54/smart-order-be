import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OrderItem, OrderItemSchema } from 'domains/orders/schemas/order-item.schema'
import mongoose, { Types } from 'mongoose'

@Schema({ timestamps: true, versionKey: false, collection: 'Orders' })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: mongoose.Types.ObjectId

  @Prop([OrderItemSchema])
  items: OrderItem[]

  @Prop({ required: true })
  totalPrice: number

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Table' })
  table: Types.ObjectId
}

export const OrderSchema = SchemaFactory.createForClass(Order)

export type OrderDocument = mongoose.HydratedDocument<
  Order,
  {
    items: mongoose.Types.DocumentArray<OrderItem>
  }
>
