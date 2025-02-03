import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AccountType, AuthTokenPayload } from 'core/types/type'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtEmployeeStrategy extends PassportStrategy(Strategy, 'jwt-employee') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('employeeAccessToken.secret')
    })
  }

  /**
   * @param payload là object decode từ accessToken
   * @returns object user mà ta gán vào req - phục vụ cho các route tiếp theo
   */
  validate(payload: AuthTokenPayload): AccountType {
    delete payload.exp
    delete payload.iat
    return payload
  }
}
