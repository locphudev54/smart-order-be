import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Role } from 'core/constants/enum'
import { IAccountType } from 'core/types/account.type'
import { IAuthTokenPayload, IAuthTokenType } from 'core/types/auth.type'
import { AccountsService } from 'domains/accounts/accounts.service'
import { ChangePasswordDto } from 'domains/auth/dtos/change-password.dto'
import { ForgotPasswordtDto } from 'domains/auth/dtos/forgot-password.dto'
import { RefreshTokenDto } from 'domains/auth/dtos/refresh-token.dto'
import { RegisterAccountDto } from 'domains/auth/dtos/register-account-dto'
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
   * @param account chính là req.user từ LocalStrategy ~ kết quả trả về của hàm validateAccount()
   */
  async login(account: IAccountType) {
    const payload: IAuthTokenPayload = { email: account.email, fullName: account.fullName, role: account.role }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload)
    ])
    await this.accountsService.updateRefreshToken(account._id.toString(), refreshToken)

    return {
      accessToken,
      refreshToken,
      account: {
        email: account.email,
        fullName: account.fullName,
        avatarUrl: account.avatarUrl,
        role: account.role
      }
    }
  }

  async register(registerAccountDto: RegisterAccountDto) {
    const { email, fullName, password } = registerAccountDto

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({
        email,
        fullName,
        role: Role.Customer
      }),
      this.signRefreshToken({
        email,
        fullName,
        role: Role.Customer
      })
    ])
    const newAccount = await this.accountsService.create({ email, password, fullName, refreshToken })

    return {
      accessToken,
      refreshToken,
      account: {
        email: newAccount.email,
        fullName: newAccount.fullName,
        avatarUrl: newAccount.avatarUrl,
        role: newAccount.role
      }
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      if (!refreshTokenDto.refreshToken) {
        throw new UnauthorizedException('Refresh token không hợp lệ')
      }

      const account = await this.accountsService.findByRefreshToken(refreshTokenDto.refreshToken)
      if (!account) {
        throw new UnauthorizedException('Refresh token không hợp lệ')
      }

      const decodedOldRefreshToken = await this.jwtService.verifyAsync<IAuthTokenType>(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('refreshToken.secret')
      })

      const payload: IAuthTokenPayload = { email: account.email, fullName: account.fullName, role: account.role }
      const [accessToken, refreshToken] = await Promise.all([
        this.signAccessToken(payload),
        this.signRefreshToken(payload, decodedOldRefreshToken.exp)
      ])
      await this.accountsService.updateRefreshToken(account._id.toString(), refreshToken)

      return {
        accessToken,
        refreshToken,
        account
      }
    } catch (error) {
      throw new UnauthorizedException('Refresh token hết hạn')
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordtDto) {
    const { email, password } = forgotPasswordDto
    const account = await this.accountsService.findByEmail(email)
    if (!account) {
      throw new BadRequestException('Email không tồn tại trên hệ thống')
    }
    return this.accountsService.updatePassword(account._id.toString(), password)
  }

  async changePassword(changePasswordDto: ChangePasswordDto, account: IAccountType) {}

  signAccessToken(payload: IAuthTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('accessToken.secret'),
      expiresIn: ms(this.configService.get<StringValue>('accessToken.expiresIn')) / 1000
    })
  }

  signRefreshToken(payload: IAuthTokenPayload, exp?: number) {
    if (exp) {
      const expiresIn = Math.ceil((new Date(exp * 1000).getTime() - new Date().getTime()) / 1000)
      return this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('refreshToken.secret'),
        expiresIn
      })
    }
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('refreshToken.secret'),
      expiresIn: ms(this.configService.get<StringValue>('refreshToken.expiresIn')) / 1000 // chia 1000 để đổi từ milisecond -> second
    })
  }
}
