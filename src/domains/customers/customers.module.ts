import { Module } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { CustomersController } from './customers.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Customer, CustomerSchema } from 'domains/customers/schemas/customer.schema'
import { JwtService } from '@nestjs/jwt'
import { LocalCustomerStrategy } from 'domains/customers/local-customer.strategy'
import { TablesModule } from 'domains/tables/tables.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]), TablesModule],
  controllers: [CustomersController],
  providers: [CustomersService, LocalCustomerStrategy, JwtService]
})
export class CustomersModule {}
