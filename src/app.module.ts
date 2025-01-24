import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from './core/core.module'
import { AccountsModule } from './domains/accounts/accounts.module'
import { AuthModule } from 'domains/auth/auth.module'
import { MediaModule } from './domains/media/media.module'

@Module({
  imports: [CoreModule, AuthModule, AccountsModule, MediaModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
