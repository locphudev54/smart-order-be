import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { NotFoundError } from 'core/exceptions/errors.exception'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { generateOrderCode } from 'core/utils/utils'
import { CustomersService } from 'domains/customers/customers.service'
import { DeleteBulkDto } from 'domains/orders/dto/delete-bulk.dto'
import { OrderQueryDto } from 'domains/orders/dto/order-query.dto'
import { Order, OrderDocument } from 'domains/orders/schemas/order.schema'
import { TablesService } from 'domains/tables/tables.service'
import { FilterQuery, Model } from 'mongoose'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrdersGateway } from 'domains/orders/orders.gateway'
import moment from 'moment-timezone'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,
    private readonly tablesService: TablesService,
    private readonly ordersGateway: OrdersGateway
  ) {}

  async create(createOrderDto: CreateOrderDto, fromCustomer?: boolean) {
    const { tableNumber, items } = createOrderDto
    const table = await this.tablesService.findByTableNumber(tableNumber)
    if (!table) {
      throw new NotFoundError('Bàn không tồn tại')
    }

    // ---------------- Khách hàng đang ngồi ở bàn -------------------------
    if (table.customer) {
      const customerId = table.customer
      const previousOrder = await this.orderModel.findOne({ customer: customerId })
      // TH1: KH mới đăng nhập xong và trong lần đầu gọi món (có thể là NV hoặc KH sẽ gọi)
      if (!previousOrder) {
        const orderCode = generateOrderCode()
        const newOrders = await Promise.all(
          items.map(({ price, dish, note, quantity }) =>
            this.orderModel.create({
              code: orderCode,
              customer: customerId,
              table: table._id,
              tableNumber: table.number,
              dish,
              note,
              price,
              quantity,
              totalPrice: price * quantity
            })
          )
        )

        if (fromCustomer) {
          this.ordersGateway.emitNewOrder({ tableNumber, quantity: newOrders.length })
        }
        return newOrders
      }
      // TH2: Đã có đơn hàng trước đó và tiếp tục gọi thêm món (có thể là NV hoặc KH sẽ gọi)
      // -> thêm các đơn hàng có cùng mã CODE với KH hiện tại
      const previousOrderCode = previousOrder.code
      const newOrders = await Promise.all(
        items.map(({ price, dish, note, quantity }) =>
          this.orderModel.create({
            code: previousOrderCode,
            customer: customerId,
            table: table._id,
            tableNumber: table.number,
            dish,
            note,
            price,
            quantity,
            totalPrice: price * quantity
          })
        )
      )
      if (fromCustomer) {
        this.ordersGateway.emitNewOrder({ tableNumber, quantity: newOrders.length })
      }
      return newOrders
    } else {
      //TH3: Nhân viên tạo đơn hàng đầu tiên cho KH mới vô quán
      const newCustomer = await this.customersService.create({ table })
      const orderCode = generateOrderCode()
      return Promise.all(
        items.map(({ price, dish, note, quantity }) =>
          this.orderModel.create({
            code: orderCode,
            customer: newCustomer._id,
            table: table._id,
            tableNumber: table.number,
            dish,
            note,
            price,
            quantity,
            totalPrice: price * quantity
          })
        )
      )
    }
  }

  async findAll(qs: PaginationQueryDto & DateRangeQueryDto & OrderQueryDto) {
    const { page, limit, from, to, sort: sortQuery, customerCode, status, code, tableNumber } = qs
    // sort và status là những query có gtri đặc biệt -> phải transform thành cú pháp hợp lệ trước khi mà thực hiện filter
    // customerCode và tableNumber là query đặc biệt -> dùng để query nested Object
    // Cho nên ta phải tasck 3 query value đó ra riêng

    // Filter key of nested object
    const customerId = (await this.customersService.findByCode(customerCode))?._id

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
      filter.tableNumber = { $in: tableNumber }
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
      .populate([{ path: 'customer', select: ['_id', 'code'] }, { path: 'dish' }])

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
    const order = await this.orderModel
      .findOne({ _id: id })
      .populate([{ path: 'customer', select: ['_id', 'code'] }, { path: 'dish' }])
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

    // TODO:  Hiện Toast để người dùng cập nhật lại thành bàn trống khi mà trạng thái mới là Canceled, Paid,...
    // if ([OrderStatus.Paid, OrderStatus.Canceled].includes(updateOrderDto.status)) {
    //   await this.tablesService.update(order.table.id, { status: TableStatus.Available, customer: null })
    // } else {
    //   await this.tablesService.update(order.table.id, { status: TableStatus.Occupied, customer: order.customer._id })
    // }

    const customerCode = order.customer.code
    const dishTitle = order.dish.title
    const { status } = updateOrderDto
    this.ordersGateway.emitUpdateOrder(customerCode, { dishTitle, status })
    return this.orderModel.findOneAndUpdate(
      {
        _id: id
      },
      { status },
      {
        returnOriginal: false
      }
    )
  }

  async remove(id: string) {
    return this.orderModel.deleteOne({ _id: id })
  }

  async removeBulk(ids: DeleteBulkDto) {
    return this.orderModel.deleteMany({ _id: ids })
  }
}
