import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { Roles } from 'core/decorators/roles.decorator'
import { Role } from 'core/constants/enum'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { Account } from 'core/decorators/account.decorator'
import { AccountType } from 'core/types/type'
import { BillsService } from 'domains/bills/bills.service'
import { CreateBillDto } from 'domains/bills/dtos/create-bill.dto'

@Controller('bills')
export class BillsController {
  constructor(private readonly invoicesService: BillsService) {}

  @Post()
  @ResponseMessage('Tạo mới phiếu tính tiền thành công')
  create(@Body() createBillDto: CreateBillDto, @Account() account: AccountType) {
    return this.invoicesService.create(createBillDto, account)
  }

  @Roles([Role.Manager])
  @Get()
  @ResponseMessage('Lấy danh sách phiếu tính tiền thành công')
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.invoicesService.findAll(paginationQuery)
  }
}
