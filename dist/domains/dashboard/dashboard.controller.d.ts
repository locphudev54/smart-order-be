import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto';
import { DashboardService } from 'domains/dashboard/dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStatistics(dateRangeQuery: DateRangeQueryDto): Promise<{
        totalRevenue: number;
        countCustomers: number;
        countOrders: number;
        revenueChartData: {
            date: string;
            totalPrice: number;
        }[];
    }>;
}
