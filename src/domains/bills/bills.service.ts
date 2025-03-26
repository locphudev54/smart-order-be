import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { OrderStatus } from 'core/constants/enum'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { AccountType } from 'core/types/type'
import { generateBillCode } from 'core/utils/utils'
import { CreateBillDto } from 'domains/bills/dtos/create-bill.dto'
import { Bill } from 'domains/bills/schemas/bill.schema'
import { OrdersService } from 'domains/orders/orders.service'
import { Model } from 'mongoose'

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill.name) private readonly invoiceModel: Model<Bill>,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService
  ) {}

  async create(createBillDto: CreateBillDto, account: AccountType) {
    const { customerCode } = createBillDto
    const orderQuery = await this.ordersService.findAll({ customerCode, status: [OrderStatus.Paid] })

    let totalPrice = 0
    const orderItems = orderQuery.data.map((order) => {
      const { dish, quantity, price } = order
      totalPrice += quantity * price
      return {
        dish: dish._id,
        quantity,
        price
      }
    })

    const invoiceCode = generateBillCode()
    const { tableNumber } = orderQuery.data[0]
    return this.invoiceModel.create({
      invoiceCode,
      orderItems,
      customerCode,
      totalPrice,
      tableNumber,
      account: account._id
    })
  }

  async findAll(qs: PaginationQueryDto) {
    const { page, limit, ...filter } = qs
    const query = this.invoiceModel
      .find(filter)
      .populate([{ path: 'orderItems.dish' }, { path: 'account', select: ['fullName', 'email', 'role'] }])

    if (limit && page) {
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .sort('-createdAt')
    }

    const [data, totalDocuments] = await Promise.all([query, this.invoiceModel.countDocuments(filter)])

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
