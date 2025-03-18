import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { OrderStatus } from 'core/constants/enum'
import { CustomerDocument } from 'domains/customers/schemas/customer.schema'
import mongoose, { type Types } from 'mongoose'
import timeZone from 'mongoose-timezone'
import { DishDocument } from 'domains/dishes/schemas/dish.schema'
import moment from 'moment-timezone'

export type OrderDocument = mongoose.HydratedDocument<Order>

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'Orders'
})
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: CustomerDocument

  @Prop({ required: true, unique: false })
  code: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' })
  dish: DishDocument

  @Prop({ required: true, type: Number })
  price: number

  @Prop({ required: true, type: Number })
  quantity: number

  @Prop({ required: true })
  totalPrice: number

  @Prop({ default: '' })
  note: string

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Pending })
  status?: OrderStatus

  @Prop({ required: true, type: Number })
  tableNumber: number

  // @Prop({ default: () => moment().tz('Asia/Ho_Chi_Minh').toDate() })
  // createdAt: Date

  // @Prop({ default: () => moment().tz('Asia/Ho_Chi_Minh').toDate() })
  // updatedAt: Date
}

export const OrderSchema = SchemaFactory.createForClass(Order)

// OrderSchema.pre('save', function (next) {
//   this.updatedAt = moment().tz('Asia/Ho_Chi_Minh').toDate()
//   next()
// })

// OrderSchema.plugin(timeZone)
