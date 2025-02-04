import { forwardRef, Module } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { CustomersController } from './customers.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Customer, CustomerSchema } from 'domains/customers/schemas/customer.schema'
import { JwtService } from '@nestjs/jwt'
import { LocalCustomerStrategy } from 'domains/customers/local-customer.strategy'
import { TablesModule } from 'domains/tables/tables.module'
import { JwtCustomerStrategy } from 'domains/customers/jwt-customer.strategy'
import { OrdersModule } from 'domains/orders/orders.module'
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    TablesModule,
    forwardRef(() => OrdersModule)
  ],
  controllers: [CustomersController],
  providers: [CustomersService, LocalCustomerStrategy, JwtCustomerStrategy, JwtService],
  exports: [CustomersService]
})
export class CustomersModule {}
