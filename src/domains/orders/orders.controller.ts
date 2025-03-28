import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { OrderQueryDto } from 'domains/orders/dto/order-query.dto'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrdersService } from './orders.service'
import { ValidateDateRange } from 'core/pipes/validate-date-range.pipe'
import { DeleteBulkDto } from 'domains/orders/dto/delete-bulk.dto'
import { Roles } from 'core/decorators/roles.decorator'
import { Role } from 'core/constants/enum'
import { AccountType } from 'core/types/type'
import { Account } from 'core/decorators/account.decorator'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles([Role.Manager, Role.Waiter])
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

  @Get('statistics-by-tables')
  @ResponseMessage('Lấy danh sách thống kê đơn hàng theo từng bàn thành công')
  findByTables() {
    return this.ordersService.getStatisticsByTables()
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

  @Delete('bulk-delete')
  removeBulk(@Body() body: DeleteBulkDto) {
    return this.ordersService.removeBulk(body)
  }

  @Delete(':id')
  @Roles([Role.Manager, Role.Waiter])
  @ResponseMessage('Xoá đơn hàng thành công')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.ordersService.remove(id)
  }

  @Get('checkout/:customerId')
  @Roles([Role.Manager, Role.Waiter])
  @ResponseMessage('Thanh toán đơn hàng cho khách thành công')
  checkout(@Param('customerId', ValidateMongoIdPipe) customerId: string, @Account() account: AccountType) {
    return this.ordersService.checkout(customerId, account)
  }
}
