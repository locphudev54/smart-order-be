import { forwardRef, Module } from '@nestjs/common'
import { TablesService } from './tables.service'
import { TablesController } from './tables.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Table, TableSchema } from 'domains/tables/schemas/table.schema'
import { JwtService } from '@nestjs/jwt'
import { CustomersModule } from 'domains/customers/customers.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]), forwardRef(() => CustomersModule)],
  controllers: [TablesController],
  providers: [TablesService, JwtService],
  exports: [TablesService]
})
export class TablesModule {}
