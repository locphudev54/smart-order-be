import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { OrderQueryDto } from 'domains/orders/dto/order-query.dto'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrdersService } from './orders.service'
import { ValidateDateRange } from 'core/pipes/validate-date-range.pipe'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage('Tạo đơn hàng thành công')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto)
  }

  @Get()
  @ResponseMessage('Lấy danh sách đơn hàng thành công')
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query(ValidateDateRange) dateRangeQuery: DateRangeQueryDto,
    @Query() orderQuery: OrderQueryDto
  ) {
    return this.ordersService.findAll({ ...paginationQuery, ...dateRangeQuery, ...orderQuery })
  }

  @Get(':id')
  @ResponseMessage('Lấy chi tiết đơn hàng thành công')
  findOne(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.ordersService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật đơn hàng thành công')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto)
  }
}
