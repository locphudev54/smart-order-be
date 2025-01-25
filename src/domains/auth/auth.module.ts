import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtService } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { LocalStrategy } from 'domains/auth/local.strategy'
import { JwtStrategy } from 'domains/auth/jwt.strategy'
import { AccountsModule } from 'domains/accounts/accounts.module'
import { CaslModule } from 'core/casl/casl.module'

@Module({
  imports: [PassportModule, AccountsModule, CaslModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtService]
})
export class AuthModule {}
