import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Table, TableDocument } from 'domains/tables/schemas/table.schema'
import mongoose, { HydratedDocument, Types } from 'mongoose'

export type CustomerDocument = HydratedDocument<Customer>

@Schema({ timestamps: true, versionKey: false, collection: 'Customers' })
export class Customer {
  @Prop({ required: true, unique: true })
  code: string

  @Prop({ required: true, type: Number })
  tableNumber: number

  @Prop({ default: '' })
  refreshToken?: string
}

export const CustomerSchema = SchemaFactory.createForClass(Customer)
