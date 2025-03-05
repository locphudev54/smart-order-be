import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { TableStatus } from 'core/constants/enum'
import { CustomerDocument } from 'domains/customers/schemas/customer.schema'
import mongoose, { HydratedDocument, Types } from 'mongoose'

export type TableDocument = HydratedDocument<Table>

@Schema({ timestamps: true, versionKey: false, collection: 'Tables' })
export class Table {
  @Prop({ required: true, unique: true })
  number: number

  @Prop({ required: true })
  capacity: number

  // NOTE: Schema Prop: Enum
  @Prop({ type: String, enum: TableStatus, default: TableStatus.Available })
  status: TableStatus

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null })
  customer: Types.ObjectId

  @Prop({ required: true, unique: true })
  reservationLink: string

  @Prop({ required: true, unique: true })
  token: string
}

export const TableSchema = SchemaFactory.createForClass(Table)
