import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OrderStatus } from 'core/constants/enum'
import { CustomerDocument } from 'domains/customers/schemas/customer.schema'
import { OrderItem, OrderItemSchema } from 'domains/orders/schemas/order-item.schema'
import { TableDocument } from 'domains/tables/schemas/table.schema'
import mongoose from 'mongoose'

@Schema({ timestamps: true, versionKey: false, collection: 'Orders' })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: CustomerDocument

  @Prop({ required: true, unique: true })
  code: string

  @Prop([OrderItemSchema])
  items: OrderItem[]

  @Prop({ required: true })
  totalPrice: number

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Pending })
  status?: OrderStatus

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Table' })
  table: TableDocument
}

export const OrderSchema = SchemaFactory.createForClass(Order)

export type OrderDocument = mongoose.HydratedDocument<
  Order,
  {
    items: mongoose.Types.DocumentArray<OrderItem>
  }
>
