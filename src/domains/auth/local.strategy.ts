import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { AuthService } from 'domains/auth/auth.service'
import { AccountType } from 'core/types/type'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<AccountType> {
    const account = await this.authService.validateAccount(email, password)
    if (!account) {
      throw new UnprocessableEntityException('Email/Password không tồn tại trên hệ thống')
    }

    // Gán vào req.user
    return {
      _id: account._id,
      avatarUrl: account.avatarUrl,
      email: account.email,
      fullName: account.fullName,
      role: account.role
    }
  }
}
