import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { OrderStatus, TableStatus } from 'core/constants/enum'
import { NotFoundError } from 'core/exceptions/errors.exception'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { generateOrderCode } from 'core/utils/utils'
import { CustomersService } from 'domains/customers/customers.service'
import { OrderQueryDto } from 'domains/orders/dto/order-query.dto'
import { Order, OrderDocument } from 'domains/orders/schemas/order.schema'
import { TablesService } from 'domains/tables/tables.service'
import { Model, Types } from 'mongoose'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,
    private readonly tablesService: TablesService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { tableNumber, items } = createOrderDto
    const table = await this.tablesService.findByTableNumber(tableNumber)
    if (!table) {
      throw new NotFoundError('Bàn không tồn tại')
    }

    let customerId: Types.ObjectId | undefined = undefined
    // Kiểm tra xem đơn hàng mới cho bàn này là của khách hàng đang sử dụng hay là của khách hàng mới
    if (table.customer) {
      // Khách hàng đã đặt hoặc đang ngồi ở bàn
      customerId = table.customer
    } else {
      // Khách hàng chưa đặt bàn
      const newCustomer = await this.customersService.create({ table })
      customerId = newCustomer._id
    }

    let totalPrice = items.reduce((result, orderItem) => {
      return result + orderItem.price * orderItem.quantity
    }, 0)

    const previousOrder = await this.orderModel.findOne({ customer: customerId })
    if (!previousOrder) {
      // TH1: Lần đầu đặt món ăn -> Tạo mới Order như bình thường
      const orderCode = generateOrderCode()
      return this.orderModel.create({
        customer: customerId,
        items,
        table: table._id,
        totalPrice,
        code: orderCode
      })
    } else {
      // TH2: Đã có đơn hàng trước đó -> Thêm mới các OrdeItem lúc sau vào mảng items
      totalPrice = totalPrice + previousOrder.totalPrice
      return this.orderModel.findOneAndUpdate(
        {
          _id: previousOrder._id
        },
        {
          $push: {
            items
          },
          totalPrice
        },
        {
          returnOriginal: false
        }
      )
    }
  }

  async findAll(qs: PaginationQueryDto & DateRangeQueryDto & OrderQueryDto) {
    const { page, limit, from, to, sort: sortQuery, ...orderFilter } = qs
    // sort: createdAt.asc || createdAt.desc
    const sortField = sortQuery?.split('.')?.[0]
    const sort = sortQuery?.split('.')?.[1] === 'desc' ? `-${sortField}` : sortField

    // Filter key of nested object
    const { customerCode } = orderFilter
    delete orderFilter.customerCode
    const customerId = (await this.customersService.findByCode(customerCode))?._id

    const filter: any = orderFilter
    if (customerCode) {
      filter.customer = customerId
    }

    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = from
      if (to) filter.createdAt.$lt = to
    }

    const query = this.orderModel
      .find(filter)
      .populate([
        { path: 'customer', select: ['_id', 'code'] },
        { path: 'items.dish' },
        { path: 'table', select: ['-token', '-reservationLink'] }
      ])

    if (limit && page) {
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort)
    }

    const [data, totalDocuments] = await Promise.all([query, this.orderModel.countDocuments(filter)])

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

  async findOne(id: string) {
    const order = await this.orderModel.findOne({ _id: id }).populate([
      { path: 'customer', select: ['_id', 'name'] },
      { path: 'items.dish' },
      {
        path: 'table',
        select: ['-token', '-reservationLink']
      }
    ])
    if (!order) {
      throw new NotFoundError('Đơn hàng không tồn tại')
    }
    return order
  }

  async findOneByCustomerId(customerId: string) {
    const order = await this.orderModel.findOne({ customer: customerId }).populate([
      { path: 'customer', select: ['_id', 'name'] },
      { path: 'items.dish' },
      {
        path: 'table',
        select: ['-token', '-reservationLink']
      }
    ])
    if (!order) {
      throw new NotFoundError('Đơn hàng không tồn tại')
    }
    return order
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id)
    if (!order) {
      throw new NotFoundError('Đơn hàng không tồn tại')
    }

    if ([OrderStatus.Paid, OrderStatus.Canceled].includes(updateOrderDto.status)) {
      await this.tablesService.update(order.table.id, { status: TableStatus.Available, customer: null })
    } else {
      await this.tablesService.update(order.table.id, { status: TableStatus.Occupied, customer: order.customer._id })
    }

    return this.orderModel.findOneAndUpdate(
      {
        _id: id
      },
      updateOrderDto,
      {
        returnOriginal: false
      }
    )
  }
}
