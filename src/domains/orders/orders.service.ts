import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DishStatus, OrderStatus, TableStatus } from 'core/constants/enum'
import { BadRequestError, NotFoundError } from 'core/exceptions/errors.exception'
import { DateRangeQueryDto } from 'core/query-string-dtos/date-range-query.dto'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { AccountType } from 'core/types/type'
import { generateOrderCode } from 'core/utils/utils'
import { endOfToday, startOfToday } from 'date-fns'
import { BillsService } from 'domains/bills/bills.service'
import { CustomersService } from 'domains/customers/customers.service'
import { DeleteBulkDto } from 'domains/orders/dto/delete-bulk.dto'
import { OrderQueryDto } from 'domains/orders/dto/order-query.dto'
import { OrdersGateway } from 'domains/orders/orders.gateway'
import { Order, OrderDocument } from 'domains/orders/schemas/order.schema'
import { TablesService } from 'domains/tables/tables.service'
import { FilterQuery, Model } from 'mongoose'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { orderStatusFSM } from 'domains/orders/order.machine'
import { DishesService } from 'domains/dishes/dishes.service'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,
    private readonly tablesService: TablesService,
    private readonly ordersGateway: OrdersGateway,
    private readonly billsService: BillsService,
    private readonly dishesService: DishesService
  ) {}

  async create(createOrderDto: CreateOrderDto, fromCustomer?: boolean) {
    const { tableNumber, items } = createOrderDto
    const table = await this.tablesService.findByTableNumber(tableNumber)
    if (!table) {
      throw new NotFoundError('Bàn không tồn tại')
    }

    // Kiểm tra trạng thái món ăn có hợp lệ hay không
    const checkDishesStatusPromises = items.map(async (dishItem) => {
      const dish = await this.dishesService.findOne(dishItem.dish.toString())
      if (dish.status === DishStatus.Unavailable) {
        throw new BadRequestError('Món ăn bạn tạo đã hết hàng')
      }
    })

    try {
      await Promise.all(checkDishesStatusPromises)
    } catch (error) {
      throw error
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
      // Trong trường hợp khách hàng tắt tab trình duyệt + Đã hoàn tất đơn cho KH đó + KH vào lại trang web để gọi món thì không co đặt
      if (fromCustomer) {
        throw new BadRequestError('Bạn không thể tiếp tục gọi món! Vui lòng đăng xuất')
      }

      //TH4: Nhân viên tạo đơn hàng đầu tiên cho KH mới vô quán
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

  async getStatisticsByTables() {
    const tableQuery = await this.tablesService.findAll({})
    const tableNumbers = tableQuery.data.map((table) => table.number)
    const orderStatuses = Object.values(OrderStatus)

    const from = startOfToday()
    const to = endOfToday()
    const orderQuery = await this.findAll({ from, to })

    const statisticsResult = tableNumbers.map((tableNumber) => ({
      tableNumber,
      orders: [] as Order[],
      statusCounts: orderStatuses.reduce(
        (acc, status) => {
          acc[status] = 0
          return acc
        },
        {} as Record<OrderStatus, number>
      )
    }))

    const tablesHasCustomer = tableQuery.data.filter((table) => table.customer && table.status === TableStatus.Occupied)
    const customerIds = tablesHasCustomer.map((table) => table.customer.id)
    const currentOrdersInTables = orderQuery.data.filter((order) => customerIds.includes(order.customer.id))

    currentOrdersInTables.forEach((order) => {
      statisticsResult.forEach((summary) => {
        if (summary.tableNumber === order.tableNumber) {
          summary.statusCounts[order.status] += 1
          summary.orders.push(order)
        }
      })
    })

    return statisticsResult
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

  canTransitionStatus(current: OrderStatus, next: OrderStatus): boolean {
    return orderStatusFSM[current].includes(next)
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id)
    if (!order) {
      throw new NotFoundError('Đơn hàng không tồn tại')
    }

    // -------------------------- Finite State Machine --------------------------
    const currentStatus = order.status
    const { status: nextStatus } = updateOrderDto
    if (!this.canTransitionStatus(currentStatus, nextStatus)) {
      throw new BadRequestError(`Không thể chuyển trạng thái đơn hàng từ ${currentStatus} sang ${nextStatus}`)
    }

    const customerCode = order.customer.code
    const dishTitle = order.dish.title

    this.ordersGateway.emitUpdateOrder(customerCode, { dishTitle, status: nextStatus })
    return this.orderModel.findOneAndUpdate(
      {
        _id: id
      },
      { status: nextStatus },
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

  async checkout(customerId: string, account: AccountType) {
    const [customer] = await Promise.all([
      this.customersService.findOne(customerId),
      this.orderModel.updateMany(
        { customer: customerId, status: { $nin: [OrderStatus.Rejected, OrderStatus.Canceled] } },
        { status: OrderStatus.Paid }
      ),
      this.customersService.updateRefreshToken(customerId, '')
    ])

    const customerCode = customer.code
    const { tableNumber } = customer

    const [bill] = await Promise.all([
      this.billsService.create({ customerCode }, account),
      this.tablesService.updateByNumber(tableNumber, { customer: null, status: TableStatus.Available })
    ])
    this.ordersGateway.emitLogout(customerId)
    return bill
  }
}
