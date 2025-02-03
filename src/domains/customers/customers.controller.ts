import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { Public } from 'core/decorators/public.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { CustomerType } from 'core/types/type'
import { LocalCustomerAuthGuard } from 'core/guards/local-customer-auth.guard'
import { RefreshTokenDto } from 'domains/customers/dto/refresh-token.dto'
import { LogoutDto } from 'domains/customers/dto/logout.dto'
import { CreateOrderByCustomerDto } from 'domains/customers/dto/create-order-by-customer.dto'
import { Customer } from 'core/decorators/customer.decorator'
import { CustomerRoute } from 'core/decorators/customer-route.decorator'

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // Chỉ có nhân viên mới có quyền tạo mới customer thông qua route này - còn chính bản thân customer thì phải cần tableToken khi login
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto)
  }

  @Post('orders')
  createOrder(@Body() createOrderDto: CreateOrderByCustomerDto, @Customer() customer: CustomerType) {
    return this.customersService.createOrder(createOrderDto, customer)
  }

  // --------------------- CUSTOMER'S AUTH ROUTES -------------------

  @Public()
  @UseGuards(LocalCustomerAuthGuard)
  @Post('auth/login')
  @ResponseMessage('Login thành công')
  login(@Request() req) {
    return this.customersService.login(req.user as CustomerType)
  }

  @Public()
  @Post('auth/refresh-token')
  @ResponseMessage('Refresh token thành công')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.customersService.refreshToken(refreshTokenDto)
  }

  @CustomerRoute()
  @Post('auth/logout')
  @ResponseMessage('Logout thành công')
  logout(@Body() logoutDto: LogoutDto) {
    return this.customersService.logout(logoutDto)
  }
}
