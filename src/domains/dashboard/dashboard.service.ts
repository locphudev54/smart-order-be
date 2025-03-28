import { Injectable } from '@nestjs/common'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { format } from 'date-fns'
import { BillsService } from 'domains/bills/bills.service'
import { CustomersService } from 'domains/customers/customers.service'
import { OrdersService } from 'domains/orders/orders.service'

@Injectable()
export class DashboardService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly ordersService: OrdersService,
    private readonly billsService: BillsService
  ) {}

  async statistic(dateRange: DateRangeQueryDto) {
    const [billListQuery, customerListQuery, orderListQuery] = await Promise.all([
      this.billsService.findAll(dateRange),
      this.customersService.findAll(dateRange),
      this.ordersService.findAll(dateRange)
    ])

    const totalRevenue = billListQuery.data.reduce((result, bill) => result + bill.totalPrice, 0)
    const countCustomers = customerListQuery.meta.totalDocuments
    const countOrders = orderListQuery.meta.totalDocuments

    const revenueChartData = billListQuery.data.map((bill) => ({
      date: format(new Date((bill as any).createdAt), 'yyyy-MM-dd'),
      totalPrice: bill.totalPrice
    }))

    return {
      totalRevenue,
      countCustomers,
      countOrders,
      revenueChartData
    }
  }
}
