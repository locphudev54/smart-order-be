import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CustomerTokenPayload, CustomerType } from 'core/types/type'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtCustomerStrategy extends PassportStrategy(Strategy, 'jwt-customer') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('customerAccessToken.secret')
    })
  }

  /**
   *
   * @param payload là object decode từ accessToken
   * @returns object user mà ta gán vào req - phục vụ cho các route tiếp theo
   */
  validate(payload: CustomerTokenPayload): CustomerType {
    delete payload.exp
    delete payload.iat
    return payload
  }
}
