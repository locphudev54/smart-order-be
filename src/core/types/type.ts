import { Role } from 'core/constants/enum'
import { Types } from 'mongoose'

export type AccountType = {
  _id: Types.ObjectId
  email: string
  fullName: string
  avatarUrl: string
  role: Role[]
}

export type AuthTokenPayload = {
  _id: Types.ObjectId
  email: string
  fullName: string
  avatarUrl: string
  role: Role[]
  iat: number
  exp: number
}

export type QueryType = {
  [key: string]: string
}

export type TableTokenPayload = {
  tableNumber: number
  iat: number
}

export type CustomerType = {
  _id: Types.ObjectId
  name: string
  tableNumber: number
}

export type CustomerTokenPayload = {
  _id: Types.ObjectId
  name: string
  tableNumber: number
  iat: number
  exp: number
}
