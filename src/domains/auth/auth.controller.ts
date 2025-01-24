import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common'
import { Account } from 'core/decorators/account.decorator'
import { Public } from 'core/decorators/public.decorator'
import { LocalAuthGuard } from 'core/guards/auth/local-auth.guard'
import { AccountType } from 'core/types/type'
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
    return this.authService.login(req.user as AccountType)
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
  @Patch('forgot-password')
  forgotPassword(@Body() forgotPasswordtDto: ForgotPasswordtDto) {
    return this.authService.forgotPassword(forgotPasswordtDto)
  }

  @Patch('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Account() account: AccountType) {
    return this.authService.changePassword(changePasswordDto, account)
  }
}
