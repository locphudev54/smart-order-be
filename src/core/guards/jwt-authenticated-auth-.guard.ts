import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from 'core/decorators/public.decorator'
import { UnauthorizedError } from 'core/exceptions/errors.exception'
import { Request } from 'express'

// Auth guard này tương tự với OrGuard (tự động xác định accessToken secret thích hợp để decode)

@Injectable()
export class JwtAuthenticatedAuthGuard extends AuthGuard(['jwt-customer', 'jwt-employee']) {
  constructor(private reflector: Reflector) {
    super()
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedError('ACCESS_TOKEN_REQUIRED')
    }

    return super.canActivate(context)
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  handleRequest(err, user, info) {
    if (
      info instanceof TokenExpiredError ||
      (Array.isArray(info) && info.some((inforItem) => inforItem instanceof TokenExpiredError))
    ) {
      throw new UnauthorizedError('ACCESS_TOKEN_EXPIRED')
    }

    if (err || !user) {
      throw err || new UnauthorizedError('INVALID_ACCESS_TOKEN')
    }
    return user
  }
}
