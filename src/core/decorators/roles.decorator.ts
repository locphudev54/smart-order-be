import { SetMetadata } from '@nestjs/common'
import { Role } from 'core/constants/enum'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: (Role | Role[])[]) => SetMetadata(ROLES_KEY, roles.flat())
