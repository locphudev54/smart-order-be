import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { Role } from 'core/constants/enum'
import { BadRequestError, NotFoundError, UnauthorizedError } from 'core/exceptions/errors.exception'
import { AccountType, AuthTokenPayload } from 'core/types/type'
import { AccountsService } from 'domains/accounts/accounts.service'
import { ChangePasswordDto } from 'domains/auth/dtos/change-password.dto'
import { ForgotPasswordtDto } from 'domains/auth/dtos/forgot-password.dto'
import { LoginOAuthDto } from 'domains/auth/dtos/login-oauth.dto'
import { LogoutDto } from 'domains/auth/dtos/logout.dto'
import { RefreshTokenDto } from 'domains/auth/dtos/refresh-token.dto'
import { RegisterAccountDto } from 'domains/auth/dtos/register-account-dto'
import mongoose from 'mongoose'
import ms, { StringValue } from 'ms'

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateAccount(email: string, password: string) {
    const account = await this.accountsService.findAccountByEmailAndPassword({ email, password })
    if (account) {
      const { password, ...result } = account.toObject()
      return result
    }
    return null
  }

  /**
   * @param account chính là req.user từ LocalEmployeeStrategy ~ kết quả trả về của hàm validateAccount()
   */
  async login(account: AccountType) {
    const payload = account
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload)
    ])
    await this.accountsService.updateRefreshToken(account._id.toString(), refreshToken)

    return {
      accessToken,
      refreshToken,
      account
    }
  }

  async loginOAuth(loginOAuthBody: LoginOAuthDto) {
    const account = await this.accountsService.findByEmail(loginOAuthBody.email)
    if (account) {
      // Xử lý giống login
      const { email, _id, avatarUrl, role, fullName } = account
      return this.login({ email, _id: _id.toString(), avatarUrl, role, fullName })
    } else {
      // Xử lý giống register
      return this.register({
        email: loginOAuthBody.email,
        password: `${Math.ceil(Math.random() * 100000)}`,
        fullName: loginOAuthBody.email
      })
    }
  }

  async register(registerAccountDto: RegisterAccountDto) {
    const { email, fullName, password } = registerAccountDto

    const accountId = new mongoose.Types.ObjectId()
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({
        _id: accountId.toString(),
        email,
        fullName,
        role: Role.Waiter,
        avatarUrl: ''
      }),
      this.signRefreshToken({
        _id: accountId.toString(),
        email,
        fullName,
        role: Role.Waiter,
        avatarUrl: ''
      })
    ])
    const account = await this.accountsService.create({
      email,
      password,
      fullName,
      refreshToken,
      _id: accountId.toString()
    })

    // const ability = this.caslAbilityFactory.createForUser(account)
    // ability.can(Action.Read, Dish) // true
    // ability.can(Action.Delete, Dish) // false
    // ability.can(Action.Create, Dish) // false

    return {
      accessToken,
      refreshToken,
      account
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const account = await this.accountsService.findByRefreshToken(refreshTokenDto.refreshToken)
      if (!account || !refreshTokenDto.refreshToken) {
        throw new UnauthorizedError('Refresh Token không hợp lệ')
      }

      const decodedOldRefreshToken = await this.jwtService.verifyAsync<AuthTokenPayload>(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('employeeRefreshToken.secret')
      })

      const { iat, exp, ...payload } = decodedOldRefreshToken
      const [accessToken, refreshToken] = await Promise.all([
        this.signAccessToken(payload),
        this.signRefreshToken(payload, decodedOldRefreshToken.exp)
      ])
      await this.accountsService.updateRefreshToken(account._id.toString(), refreshToken)

      return {
        accessToken,
        refreshToken,
        account: payload
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedError('Refresh Token hết hạn')
      }
      throw error
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordtDto) {
    const { email, password } = forgotPasswordDto
    const account = await this.accountsService.findByEmail(email)
    if (!account) {
      throw new NotFoundError('Email không tồn tại trên hệ thống')
    }
    return this.accountsService.updatePassword(account._id.toString(), password)
  }

  async changePassword(changePasswordDto: ChangePasswordDto, account: AccountType) {
    const { oldPassword, newPassword } = changePasswordDto

    const accountDocument = await this.accountsService.findByEmail(account.email)
    if (!accountDocument) {
      throw new NotFoundError('Tài khoản không tồn tại trên hệ thống')
    }

    const isMatchPassowrd = await this.accountsService.comparePassword(oldPassword, accountDocument.password)
    if (!isMatchPassowrd) {
      throw new BadRequestError('Mật khẩu cũ không chính xác')
    }

    const payload = account
    const decodedOldRefreshToken = this.jwtService.decode<AuthTokenPayload>(accountDocument.refreshToken)
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload, decodedOldRefreshToken.exp),
      this.accountsService.updatePassword(accountDocument._id.toString(), newPassword)
    ])

    return {
      accessToken,
      refreshToken
    }
  }

  async logout(logoutDto: LogoutDto) {
    try {
      const { refreshToken } = logoutDto
      const decodedRefreshToken = await this.jwtService.verifyAsync<AuthTokenPayload>(refreshToken, {
        secret: this.configService.get<string>('employeeRefreshToken.secret')
      })
      this.accountsService.updateRefreshToken(decodedRefreshToken._id.toString(), '')
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedError('Refresh Token hết hạn')
      }
      throw error
    }
  }

  signAccessToken(payload: AccountType) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('employeeAccessToken.secret'),
      expiresIn: ms(this.configService.get<StringValue>('employeeAccessToken.expiresIn')) / 1000
    })
  }

  signRefreshToken(payload: AccountType, exp?: number) {
    if (exp) {
      return this.jwtService.signAsync(
        { ...payload, exp },
        {
          secret: this.configService.get<string>('employeeRefreshToken.secret')
        }
      )
    }
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('employeeRefreshToken.secret'),
      expiresIn: ms(this.configService.get<StringValue>('employeeRefreshToken.expiresIn')) / 1000
    })
  }
}
