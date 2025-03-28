import { Module } from '@nestjs/common'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { OrdersModule } from 'domains/orders/orders.module'
import { CustomersModule } from 'domains/customers/customers.module'
import { BillsModule } from 'domains/bills/bills.module'

@Module({
  imports: [OrdersModule, CustomersModule, BillsModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
