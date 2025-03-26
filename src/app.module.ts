import { Module } from '@nestjs/common'
import { CaslAbilityFactory } from 'core/casl/casl-ability.factory'
import { AuthModule } from 'domains/auth/auth.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from './core/core.module'
import { AccountsModule } from './domains/accounts/accounts.module'
import { CloudinaryModule } from './domains/cloudinary/cloudinary.module'
import { CustomersModule } from './domains/customers/customers.module'
import { DishesModule } from './domains/dishes/dishes.module'
import { MediaModule } from './domains/media/media.module'
import { OrdersModule } from './domains/orders/orders.module'
import { TablesModule } from './domains/tables/tables.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { BillsModule } from 'domains/bills/bills.module'
@Module({
  imports: [
    CoreModule,
    AuthModule,
    AccountsModule,
    MediaModule,
    DishesModule,
    OrdersModule,
    TablesModule,
    CustomersModule,
    CloudinaryModule,
    BillsModule
  ],
  controllers: [AppController],
  providers: [AppService, CaslAbilityFactory]
})
export class AppModule {}
