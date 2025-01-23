import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { AuthService } from 'domains/auth/auth.service'
import { IAccountType } from 'core/types/account.type'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<IAccountType> {
    const user = await this.authService.validateAccount(email, password)
    if (!user) {
      throw new UnprocessableEntityException('Email/Password không tồn tại trên hệ thống')
    }
    return user
  }
}
