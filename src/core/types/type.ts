import { Role } from 'core/constants/enum'
import { Types } from 'mongoose'

export type AccountType = {
  _id: Types.ObjectId
  email: string
  fullName: string
  avatarUrl: string
  role: Role
}

export type AuthTokenPayload = {
  _id: Types.ObjectId
  email: string
  fullName: string
  avatarUrl: string
  role: Role
  iat: number
  exp: number
}
