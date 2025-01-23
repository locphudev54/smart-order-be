import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { Account } from 'core/decorators/account.decorator'
import { Public } from 'core/decorators/public.decorator'
import { LocalAuthGuard } from 'core/guards/auth/local-auth.guard'
import { IAccountType } from 'core/types/account.type'
import { AccountsController } from 'domains/accounts/accounts.controller'
import { AuthService } from 'domains/auth/auth.service'
import { ChangePasswordDto } from 'domains/auth/dtos/change-password.dto'
import { ForgotPasswordtDto } from 'domains/auth/dtos/forgot-password.dto'
import { RefreshTokenDto } from 'domains/auth/dtos/refresh-token.dto'
import { RegisterAccountDto } from 'domains/auth/dtos/register-account-dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Public()
  @Post('register')
  register(@Body() registerAccountDto: RegisterAccountDto) {
    return this.authService.register(registerAccountDto)
  }

  @Public()
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto)
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() changePasswordDto: ForgotPasswordtDto, @Account() account: IAccountType) {
    return this.authService.forgotPassword(changePasswordDto)
  }

  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Account() account: IAccountType) {
    return this.authService.changePassword(changePasswordDto, account)
  }
}
