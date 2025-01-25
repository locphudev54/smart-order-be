import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Role } from 'core/constants/enum'
import { HydratedDocument, SchemaTypes, Types } from 'mongoose'

export type AccountDocument = HydratedDocument<Account>

@Schema({ timestamps: true })
export class Account {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  fullName: string

  @Prop({ default: '' })
  avatarUrl: string

  // NOTE: Schema Prop: Array of Enum
  @Prop({ type: [{ type: String, enum: Role }], default: [Role.Customer] })
  role: Role[]

  @Prop({ default: '' })
  refreshToken: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)
