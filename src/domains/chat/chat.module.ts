import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { WsJwtAuthGuard } from 'core/guards/ws-jwt-auth.guard'
import { ChatGateway } from 'domains/chat/chat.gateway'
@Module({
  providers: [JwtService, ChatGateway]
})
export class ChatModule {}
