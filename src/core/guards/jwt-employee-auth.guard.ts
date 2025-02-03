import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { IS_AUTHENTICATED_USER_ACCESS } from 'core/decorators/authenticated-user-access.decorator'
import { IS_CUSTOMER_ROUTE } from 'core/decorators/customer-route.decorator'
import { IS_PUBLIC_KEY } from 'core/decorators/public.decorator'
import { Request } from 'express'

@Injectable()
export class JwtEmployeeAuthGuard extends AuthGuard('jwt-employee') {
  constructor(private reflector: Reflector) {
    super()
  }
  canActivate(context: ExecutionContext) {
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

    if (isPublic || isCustomerRoutes || isAuthenticatedUserAccess) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('Không nhận được Access Token')
    }

    return super.canActivate(context)
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Access Token hết hạn')
    }

    if (err || !user) {
      throw err || new UnauthorizedException('Access Token không hợp lệ')
    }
    return user
  }
}
