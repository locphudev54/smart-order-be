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
import { FilterQuery, Model, Types } from 'mongoose'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly customersService: CustomersService,
    private readonly tablesService: TablesService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { tableNumber, items } = createOrderDto
    const table = await this.tablesService.findByTableNumber(tableNumber)
    if (!table) {
      throw new NotFoundError('Bàn không tồn tại')
    }

    let totalPrice = items.reduce((result, orderItem) => {
      return result + orderItem.price * orderItem.quantity
    }, 0)

    // ---------------- Khách hàng đang ngồi ở bàn -------------------------
    if (table.customer) {
      const customerId = table.customer
      const previousOrder = await this.findOneByCustomerId(customerId.toString())
      // TH1: + Đơn hàng liền kề trước của KH đã có trạng thái Canceled, Paid, Rejected -> tạo đơn hàng mới trên customerId cũ
      //      + KH mới đăng nhập xong và trong lần đầu gọi món
      if (
        !previousOrder ||
        (previousOrder && [OrderStatus.Canceled, OrderStatus.Paid, OrderStatus.Rejected].includes(previousOrder.status))
      ) {
        const orderCode = generateOrderCode()
        return this.orderModel.create({
          customer: customerId,
          items,
          table: table._id,
          totalPrice,
          code: orderCode
        })
      }
      // TH2: Đã có đơn hàng trước đó và tiếp tục gọi thêm món -> thêm các đơn hàng lúc sau vào mảng items
      totalPrice = totalPrice + previousOrder.totalPrice
      return this.orderModel.findOneAndUpdate(
        {
          _id: previousOrder._id
        },
        {
          $push: {
            items
          },
          totalPrice,
          status: OrderStatus.Pending
        },
        {
          returnOriginal: false
        }
      )
    } else {
      //TH3: Nhân viên tạo đơn hàng cho KH mới vô quán
      const newCustomer = await this.customersService.create({ table })
      const orderCode = generateOrderCode()
      return this.orderModel.create({
        customer: newCustomer._id,
        items,
        table: table._id,
        totalPrice,
        code: orderCode
      })
    }
  }

  async findAll(qs: PaginationQueryDto & DateRangeQueryDto & OrderQueryDto) {
    const { page, limit, from, to, sort: sortQuery, customerCode, status, code, tableNumber } = qs
    // sort và status là những query có gtri đặc biệt -> phải transform thành cú pháp hợp lệ trước khi mà thực hiện filter
    // customerCode và tableNumber là query đặc biệt -> dùng để query nested Object
    // Cho nên ta phải tasck 3 query value đó ra riêng

    // Filter key of nested object
    const customerId = (await this.customersService.findByCode(customerCode))?._id
    const tableIds = (await this.tablesService.findByTableNumberList(tableNumber)).map((table) => table._id)

    const filter: FilterQuery<OrderDocument> = {}

    if (customerCode) {
      filter.customer = customerId
    }

    if (status) {
      filter.status = { $in: status }
    }

    if (code) {
      filter.code = { $regex: code, $options: 'i' }
    }

    if (tableNumber) {
      filter.table = { $in: tableIds }
    }

    // sort: createdAt.desc || createdAt.asc
    let sort = '-createdAt'
    if (sortQuery) {
      const sortField = sortQuery.split('.')[0]
      const isDescending = sortQuery.split('.')[1] === 'desc'
      sort = isDescending ? `-${sortField}` : sortField
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
    const order = await this.orderModel.findOne({ customer: customerId }, {}, { sort: { createdAt: -1 } }).populate([
      { path: 'customer', select: ['_id', 'name'] },
      { path: 'items.dish' },
      {
        path: 'table',
        select: ['-token', '-reservationLink']
      }
    ])
    return order
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id)
    if (!order) {
      throw new NotFoundError('Đơn hàng không tồn tại')
    }

    // if ([OrderStatus.Paid, OrderStatus.Canceled].includes(updateOrderDto.status)) {
    //   await this.tablesService.update(order.table.id, { status: TableStatus.Available, customer: null })
    // } else {
    //   await this.tablesService.update(order.table.id, { status: TableStatus.Occupied, customer: order.customer._id })
    // }

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
