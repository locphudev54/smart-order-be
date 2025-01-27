import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OrderStatus } from 'core/constants/enum'
import { OrderItem, OrderItemSchema } from 'domains/orders/schemas/order-item.schema'
import mongoose, { HydratedDocument, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Guest' })
  customerId: Types.ObjectId

  @Prop([OrderItemSchema])
  item: OrderItem[]

  @Prop({ required: true })
  totalPrice: number

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Processing })
  status: OrderStatus

  @Prop({ required: true })
  tableNumber: number
}

export const OrderSchema = SchemaFactory.createForClass(Order)

export type OrderDocument = HydratedDocument<Order>

export type OrderDocumentOverride = {
  name: Types.DocumentArray<OrderItem>
}
