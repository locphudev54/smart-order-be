import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from './core/core.module'
import { AccountsModule } from './domains/accounts/accounts.module'
import { AuthModule } from 'domains/auth/auth.module'
import { MediaModule } from './domains/media/media.module'
import { DishesModule } from './domains/dishes/dishes.module'
import { OrdersModule } from './domains/orders/orders.module'
import { CaslAbilityFactory } from 'core/casl/casl-ability.factory'
import { TablesModule } from './domains/tables/tables.module'
import { CustomersModule } from './domains/customers/customers.module'
import { ChatGateway } from 'domains/chat/chat.gateway'
@Module({
  imports: [
    CoreModule,
    AuthModule,
    AccountsModule,
    MediaModule,
    DishesModule,
    OrdersModule,
    TablesModule,
    CustomersModule
    // ChatModule
  ],
  controllers: [AppController],
  providers: [AppService, CaslAbilityFactory]
})
export class AppModule {}
