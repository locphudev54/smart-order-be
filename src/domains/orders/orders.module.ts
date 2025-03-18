import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CustomersModule } from 'domains/customers/customers.module'
import { Order, OrderSchema } from 'domains/orders/schemas/order.schema'
import { TablesModule } from 'domains/tables/tables.module'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { OrdersGateway } from 'domains/orders/orders.gateway'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    forwardRef(() => CustomersModule),
    TablesModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtService, OrdersGateway],
  exports: [OrdersService]
})
export class OrdersModule {}
