import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Table, TableDocument } from 'domains/tables/schemas/table.schema'
import mongoose, { HydratedDocument, Types } from 'mongoose'

export type CustomerDocument = HydratedDocument<Customer>

@Schema({ timestamps: true, versionKey: false, collection: 'Customers' })
export class Customer {
  @Prop({ required: true, unique: true })
  code: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Table' })
  table: TableDocument

  @Prop({ default: '' })
  refreshToken?: string
}

export const CustomerSchema = SchemaFactory.createForClass(Customer)
