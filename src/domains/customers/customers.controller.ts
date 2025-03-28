import { Controller, Post, Body, UseGuards, Request, Get, Res, Req, Query } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { Public } from 'core/decorators/public.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { CustomerType } from 'core/types/type'
import { LocalCustomerAuthGuard } from 'core/guards/local-customer-auth.guard'
import { RefreshTokenDto } from 'domains/customers/dto/refresh-token.dto'
import { Customer } from 'core/decorators/customer.decorator'
import { CustomerRoute } from 'core/decorators/customer-route.decorator'
import { JwtCustomerAuthGuard } from 'core/guards/jwt-customer-auth.guard'
import { CreateOrderByCustomerDto } from 'domains/customers/dto/create-order-by-customer.dto'
import { Request as RequestType, Response } from 'express'
import { LogoutDto } from 'domains/customers/dto/logout.dto'
import { ValidateDateRange } from 'core/pipes/validate-date-range.pipe'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // ------------------------------- CUSTOMER'S ROUTES -------------------------------
  @CustomerRoute()
  @UseGuards(JwtCustomerAuthGuard)
  @Post('orders')
  @ResponseMessage('Tạo đơn hàng thành công')
  createOrder(@Body() createOrderDto: CreateOrderByCustomerDto, @Customer() customer: CustomerType) {
    return this.customersService.createOrder(createOrderDto, customer)
  }

  @CustomerRoute()
  @UseGuards(JwtCustomerAuthGuard)
  @Get('orders')
  @ResponseMessage('Lấy danh sách đơn hàng thành công')
  getOrders(@Customer() customer: CustomerType) {
    return this.customersService.findOrders(customer)
  }

  @CustomerRoute()
  @UseGuards(JwtCustomerAuthGuard)
  @Get('me')
  @ResponseMessage('Lấy thông tin khách hàng thành công')
  me(@Customer() customer: CustomerType) {
    return this.customersService.findOne(customer._id)
  }

  @Get()
  @ResponseMessage('Lấy danh sách khách hàng thành công')
  findAll(@Query() paginationQuery: PaginationQueryDto, @Query(ValidateDateRange) dateRangeQuery: DateRangeQueryDto) {
    return this.customersService.findAll({ ...paginationQuery, ...dateRangeQuery })
  }

  // ------------------------------- CUSTOMER'S AUTH ROUTES -------------------------------
  @Public()
  @UseGuards(LocalCustomerAuthGuard)
  @Post('auth/login')
  @ResponseMessage('Đăng nhập thành công')
  login(@Request() req) {
    return this.customersService.login(req.user as CustomerType)
  }

  @Public()
  @Post('auth/refresh-token')
  @ResponseMessage('Cập nhật Refresh Token thành công')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.customersService.refreshToken(refreshTokenDto)
  }

  @CustomerRoute()
  @Post('auth/logout')
  @ResponseMessage('Đăng xuất thành công')
  logout(@Body() logoutDto: LogoutDto) {
    return this.customersService.logout(logoutDto)
  }
}
