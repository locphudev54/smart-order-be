import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Role } from 'core/constants/enum'
import { HydratedDocument } from 'mongoose'

export type AccountDocument = HydratedDocument<Account>

@Schema({ timestamps: true, versionKey: false, collection: 'Accounts' })
export class Account {
  @Prop({ required: true, index: true, unique: true, type: String })
  email: string

  @Prop({ required: true, type: String })
  password: string

  @Prop({ required: true, type: String })
  fullName: string

  @Prop({ required: false, default: '', type: String })
  avatarUrl: string

  @Prop({ required: false, type: String, enum: Role, default: Role.Waiter })
  role: Role

  @Prop({ required: false, type: String, default: '' })
  refreshToken: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)
