import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from 'core/constants/enum'
import { IS_AUTHENTICATED_USER_ACCESS } from 'core/decorators/authenticated-user-access.decorator'
import { IS_CUSTOMER_ROUTE } from 'core/decorators/customer-route.decorator'
import { IS_PUBLIC_KEY } from 'core/decorators/public.decorator'
import { ROLES_KEY } from 'core/decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const isCustomerRoutes = this.reflector.getAllAndOverride<boolean>(IS_CUSTOMER_ROUTE, [
      context.getHandler(),
      context.getClass()
    ])

    const isAuthenticatedUserAccess = this.reflector.getAllAndOverride<boolean>(IS_AUTHENTICATED_USER_ACCESS, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles || isCustomerRoutes || isAuthenticatedUserAccess || isPublic) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.some((role) => user.role === role)
  }
}
