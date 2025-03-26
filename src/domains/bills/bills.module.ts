import { forwardRef, Module } from '@nestjs/common'
import { BillsService } from './bills.service'
import { MongooseModule } from '@nestjs/mongoose'
import { OrdersModule } from 'domains/orders/orders.module'
import { BillsController } from 'domains/bills/bills.controller'
import { Bill, BillSchema } from 'domains/bills/schemas/bill.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]), forwardRef(() => OrdersModule)],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService]
})
export class BillsModule {}
