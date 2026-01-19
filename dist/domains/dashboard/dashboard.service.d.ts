import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto';
import { BillsService } from 'domains/bills/bills.service';
import { CustomersService } from 'domains/customers/customers.service';
import { OrdersService } from 'domains/orders/orders.service';
export declare class DashboardService {
    private readonly customersService;
    private readonly ordersService;
    private readonly billsService;
    constructor(customersService: CustomersService, ordersService: OrdersService, billsService: BillsService);
    statistic(dateRange: DateRangeQueryDto): Promise<{
        totalRevenue: number;
        countCustomers: number;
        countOrders: number;
        revenueChartData: {
            date: string;
            totalPrice: number;
        }[];
    }>;
}
