import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Public } from 'core/decorators/public.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { CustomerType } from 'core/types/type'
import { LocalCustomerAuthGuard } from 'core/guards/local-customer-auth.guard'
import { RefreshTokenDto } from 'domains/customers/dto/refresh-token.dto'
import { LogoutDto } from 'domains/customers/dto/logout.dto'

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto)
  }

  @Get()
  findAll() {
    return this.customersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id)
  }

  // --------------------- AUTH ROUTES FOR CUSTOMER -------------------

  @Public()
  @UseGuards(LocalCustomerAuthGuard)
  @Post('auth/login')
  @ResponseMessage('Login thành công')
  login(@Request() req) {
    return this.customersService.login(req.user as CustomerType)
  }

  @Public()
  @Get('auth/refresh-token')
  @ResponseMessage('Refresh token thành công')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.customersService.refreshToken(refreshTokenDto)
  }

  @Post('auth/logout')
  @ResponseMessage('Logout thành công')
  logout(@Body() logoutDto: LogoutDto) {
    return this.customersService.logout(logoutDto)
  }
}
