import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

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
   * @returns về object user mà ta gán vào req - phục vụ cho các route tiếp theo
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }
  }
}
