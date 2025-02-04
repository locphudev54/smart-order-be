import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Types } from 'mongoose'

export type CustomerDocument = HydratedDocument<Customer>

@Schema({ timestamps: true, versionKey: false, collection: 'Customers' })
export class Customer {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Table' })
  table: Types.ObjectId

  @Prop({ default: '' })
  refreshToken?: string
}

export const CustomerSchema = SchemaFactory.createForClass(Customer)
