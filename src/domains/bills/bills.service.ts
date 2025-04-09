import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { OrderStatus } from 'core/constants/enum'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { AccountType } from 'core/types/type'
import { generateBillCode } from 'core/utils/utils'
import { CreateBillDto } from 'domains/bills/dtos/create-bill.dto'
import { Bill, BillDocument } from 'domains/bills/schemas/bill.schema'
import { OrdersService } from 'domains/orders/orders.service'
import { FilterQuery, Model } from 'mongoose'

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService
  ) {}

  async create(createBillDto: CreateBillDto, account: AccountType) {
    const { customerCode } = createBillDto
    const orderPaidQuery = await this.ordersService.findAll({ customerCode, status: [OrderStatus.Paid] })

    // Không có đơn hàng nào đã được thanh toán -> Không cần tạo hóa đơn làm gì
    if (orderPaidQuery.data.length === 0) {
      return
    }

    let totalPrice = 0
    const orderItems = orderPaidQuery.data.map((order) => {
      const { dish, quantity, price } = order
      totalPrice += quantity * price
      return {
        dish: dish._id,
        quantity,
        price
      }
    })

    const billCode = generateBillCode()
    const { tableNumber } = orderPaidQuery.data[0]
    return this.billModel.create({
      billCode,
      orderItems,
      customerCode,
      totalPrice,
      tableNumber,
      account: account._id
    })
  }

  async findAll(qs: PaginationQueryDto & DateRangeQueryDto) {
    const { page, limit, from, to } = qs

    const filter: FilterQuery<BillDocument> = {}

    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = from
      if (to) filter.createdAt.$lt = to
    }

    const query = this.billModel
      .find(filter)
      .populate([{ path: 'orderItems.dish' }, { path: 'account', select: ['fullName', 'email', 'role'] }])

    if (limit && page) {
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .sort('-createdAt')
    }

    const [data, totalDocuments] = await Promise.all([query, this.billModel.countDocuments(filter)])

    return {
      data,
      meta: {
        page: page || 1,
        limit: limit || totalDocuments,
        totalPages: limit ? Math.ceil(totalDocuments / limit) : 1,
        totalDocuments
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`
  }
}
