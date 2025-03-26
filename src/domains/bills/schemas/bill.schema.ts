import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OrderItem, OrderItemSchema } from 'domains/bills/schemas/order-item.schema'
import mongoose from 'mongoose'

@Schema({ timestamps: true, versionKey: false, collection: 'Bills' })
export class Bill {
  @Prop({ required: true, type: String })
  billCode: string

  @Prop({ required: true, type: String })
  customerCode: string

  @Prop({ required: true, type: Number })
  totalPrice: number

  @Prop({ required: true, type: Number })
  tableNumber: number

  @Prop({ required: true, type: [OrderItemSchema] })
  orderItems: OrderItem[]

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  account: mongoose.Schema.Types.ObjectId
}

export const BillSchema = SchemaFactory.createForClass(Bill)

export type BillDocument = mongoose.HydratedDocument<
  Bill,
  {
    orderItems: mongoose.Types.DocumentArray<OrderItem>
  }
>
