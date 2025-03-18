import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from 'domains/auth/auth.service'
import { AccountType } from 'core/types/type'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'

@Injectable()
export class LocalEmployeeStrategy extends PassportStrategy(Strategy, 'local-employee') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<AccountType> {
    // validate email & password
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new UnprocessableEntityError([{ message: 'Email không hợp lệ', field: 'email' }])
    }

    if (!password || password.length < 8) {
      throw new UnprocessableEntityError([{ message: 'Mật khẩu phải có ít nhất  ký tự', field: 'password' }])
    }

    const account = await this.authService.validateAccount(email, password.toString())
    if (!account) {
      throw new UnprocessableEntityError([{ field: 'password', message: 'Email/Password không tồn tại trên hệ thống' }])
    }

    // Gán vào req.user
    return {
      _id: account._id.toString(),
      avatarUrl: account.avatarUrl,
      email: account.email,
      fullName: account.fullName,
      role: account.role
    }
  }
}
