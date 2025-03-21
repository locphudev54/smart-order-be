import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { TableStatus } from 'core/constants/enum'
import { CustomerDocument } from 'domains/customers/schemas/customer.schema'
import mongoose, { HydratedDocument, Types } from 'mongoose'

export type TableDocument = HydratedDocument<Table>

@Schema({ timestamps: true, versionKey: false, collection: 'Tables' })
export class Table {
  @Prop({ required: true, unique: true, type: Number })
  number: number

  // @Prop({ required: true, type: Number })
  // capacity: number

  // NOTE: Schema Prop: Enum
  @Prop({ required: false, type: String, enum: TableStatus, default: TableStatus.Available })
  status: TableStatus

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null })
  customer: CustomerDocument

  @Prop({ required: true, unique: true, type: String })
  reservationLink: string

  @Prop({ required: true, unique: true, type: String })
  token: string
}

export const TableSchema = SchemaFactory.createForClass(Table)
