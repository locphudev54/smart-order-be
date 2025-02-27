import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto)
  }

  @Get()
  findAll(@Query() { page, limit }: PaginationQueryDto, @Query() { from, to }: DateRangeQueryDto) {
    return this.ordersService.findAll(page, limit, from, to)
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.ordersService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto)
  }
}
