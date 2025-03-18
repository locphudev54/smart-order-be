import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtService } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { LocalEmployeeStrategy } from 'domains/auth/local-employee.strategy'
import { JwtEmployeeStrategy } from 'domains/auth/jwt-employee.strategy'
import { AccountsModule } from 'domains/accounts/accounts.module'
import { CaslModule } from 'core/casl/casl.module'
import { ChatGateway } from 'domains/chat/chat.gateway'

@Module({
  imports: [PassportModule, AccountsModule, CaslModule],
  controllers: [AuthController],
  providers: [AuthService, LocalEmployeeStrategy, JwtEmployeeStrategy, JwtService]
})
export class AuthModule {}
