import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Role } from 'core/constants/enum'
import { HydratedDocument, Types } from 'mongoose'

export type AccountDocument = HydratedDocument<Account>

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  fullName: string

  @Prop({ default: '' })
  avatarUrl: string

  @Prop({ type: String, enum: Role, default: Role.Waiter })
  role: Role

  @Prop({ default: '' })
  refreshToken: string
}

export const AccountSchema = SchemaFactory.createForClass(Account)
