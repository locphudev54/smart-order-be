import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OrderStatus } from 'core/constants/enum'
import { OrderItem, OrderItemSchema } from 'domains/orders/schemas/order-item.schema'
import mongoose, { Types } from 'mongoose'

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customerId: mongoose.Types.ObjectId

  @Prop([OrderItemSchema])
  items: OrderItem[]

  @Prop({ required: true })
  totalPrice: number

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Processing })
  status: OrderStatus

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Table' })
  tableId: Types.ObjectId
}

export const OrderSchema = SchemaFactory.createForClass(Order)

export type OrderDocument = mongoose.HydratedDocument<
  Order,
  {
    items: mongoose.Types.DocumentArray<OrderItem>
  }
>
