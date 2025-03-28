import { Controller, Get, Query } from '@nestjs/common'
import { Role } from 'core/constants/enum'
import { Roles } from 'core/decorators/roles.decorator'
import { ValidateDateRange } from 'core/pipes/validate-date-range.pipe'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { DashboardService } from 'domains/dashboard/dashboard.service'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles(Role.Manager)
  getStatistics(@Query(ValidateDateRange) dateRangeQuery: DateRangeQueryDto) {
    return this.dashboardService.statistic(dateRangeQuery)
  }
}
