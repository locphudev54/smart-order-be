import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AccountType, AuthTokenPayload } from 'core/types/type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('accessToken.secret')
    })
  }

  /**
   *
   * @param payload là object decode từ accessToken
   * @returns object user mà ta gán vào req - phục vụ cho các route tiếp theo
   */
  validate(payload: AuthTokenPayload): AccountType {
    delete payload.exp
    delete payload.iat
    return payload
  }
}
