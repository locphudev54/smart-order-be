import { Role } from 'core/constants/enum'

export type AccountType = {
  _id: string
  email: string
  fullName: string
  avatarUrl: string
  role: Role
}

export type AuthTokenPayload = {
  _id: string
  email: string
  fullName: string
  avatarUrl: string
  role: Role
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
  _id: string
  tableNumber: number
  code: string
}

export type CustomerTokenPayload = {
  _id: string
  name: string
  tableNumber: number
  code: string
  iat: number
  exp: number
}
