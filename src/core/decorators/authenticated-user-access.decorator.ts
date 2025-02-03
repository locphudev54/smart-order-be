import { SetMetadata } from '@nestjs/common'

export const IS_AUTHENTICATED_USER_ACCESS = 'isAuthenticatedUserAccess'
export const AuthenticatedUserAccess = () => SetMetadata(IS_AUTHENTICATED_USER_ACCESS, true)
