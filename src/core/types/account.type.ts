import { Role } from 'core/constants/enum'
import { Types } from 'mongoose'

export type IAccountType = {
  email: string
  fullName: string
  avatarUrl: string
  role: Role
  refreshToken: string
  _id: Types.ObjectId
}
