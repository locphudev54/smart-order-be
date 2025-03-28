import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { Roles } from 'core/decorators/roles.decorator'
import { Role } from 'core/constants/enum'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { Account } from 'core/decorators/account.decorator'
import { AccountType } from 'core/types/type'
import { BillsService } from 'domains/bills/bills.service'
import { CreateBillDto } from 'domains/bills/dtos/create-bill.dto'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { ValidateDateRange } from 'core/pipes/validate-date-range.pipe'

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Roles([Role.Manager, Role.Waiter])
  @Post()
  @ResponseMessage('Tạo mới phiếu tính tiền thành công')
  create(@Body() createBillDto: CreateBillDto, @Account() account: AccountType) {
    return this.billsService.create(createBillDto, account)
  }

  @Roles([Role.Manager, Role.Waiter])
  @Get()
  @ResponseMessage('Lấy danh sách phiếu tính tiền thành công')
  findAll(@Query() paginationQuery: PaginationQueryDto, @Query(ValidateDateRange) dateRangeQuery: DateRangeQueryDto) {
    return this.billsService.findAll({ ...paginationQuery, ...dateRangeQuery })
  }
}
