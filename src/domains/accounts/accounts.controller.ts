import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { AccountQueryDto } from 'domains/accounts/dto/account-query.dto'
import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ResponseMessage('Tạo tài khoản thành công')
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto)
  }

  @Get()
  @ResponseMessage('Lấy danh sách tài khoản thành công')
  findAll(@Query() paginationQuery: PaginationQueryDto, @Query() tableQuery: AccountQueryDto) {
    return this.accountsService.findAll({ ...paginationQuery, ...tableQuery })
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin tài khoản thành công')
  findOne(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.accountsService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tài khoản thành công')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto)
  }

  @Delete(':id')
  @ResponseMessage('Xóa tài khoản thành công')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.accountsService.remove(id)
  }
}
