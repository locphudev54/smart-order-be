import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DishStatus, OrderStatus, Role, TableStatus } from 'core/constants/enum'
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
import { FilterQuery, Model, PipelineStage, SortOrder } from 'mongoose'
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
    @Inject(forwardRef(() => BillsService))
    private readonly billsService: BillsService,
    private readonly tablesService: TablesService,
    private readonly ordersGateway: OrdersGateway,
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
          this.ordersGateway.emitNewOrderByCustomer({ tableNumber, quantity: newOrders.length })
        } else {
          this.ordersGateway.emitNewOrderByEmployee(customerId as unknown as string, {
            tableNumber: table.number,
            quantity: items.length
          })
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
        this.ordersGateway.emitNewOrderByCustomer({ tableNumber, quantity: newOrders.length })
      } else {
        this.ordersGateway.emitNewOrderByEmployee(customerId as unknown as string, {
          tableNumber: table.number,
          quantity: items.length
        })
      }
      return newOrders
    } else {
      // TH3: Trong trường hợp khách hàng tắt tab trình duyệt + Đã hoàn tất đơn cho KH đó + KH vào lại trang web để gọi món thì không cho đặt
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

  async findAll(qs: PaginationQueryDto & DateRangeQueryDto & OrderQueryDto, account?: AccountType | undefined) {
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
    let sort: Record<string, 1 | -1> = { createdAt: -1 }
    if (sortQuery) {
      const sortField = sortQuery.split('.')[0]
      const isDescending = sortQuery.split('.')[1] === 'desc'
      sort = isDescending ? { [sortField]: -1 } : { [sortField]: 1 }
    }

    if (account && account.role === Role.Chef) {
      sort = { ...sort, ['dish.cookingTime']: -1 }
    }

    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = from
      if (to) filter.createdAt.$lt = to
    }

    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'Dishes',
          localField: 'dish',
          foreignField: '_id',
          as: 'dishDoc'
        }
      },
      {
        $unwind: { path: '$dishDoc', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'Customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customerDoc'
        }
      },
      {
        $unwind: { path: '$customerDoc', preserveNullAndEmptyArrays: true }
      },
      {
        $sort: sort
      },
      {
        $project: {
          // Exclude the temporary lookup fields if you don't need them
          // dishDoc: 0,
          // customerDoc: 0,

          // Include original Order fields
          _id: 1,
          code: 1,
          price: 1,
          quantity: 1,
          totalPrice: 1,
          note: 1,
          status: 1,
          tableNumber: 1,
          paidAt: 1,
          cookingCompletedAt: 1,
          createdAt: 1,
          updatedAt: 1,
          customer: {
            _id: '$customerDoc._id',
            code: '$customerDoc.code'
          },
          dish: '$dishDoc'
        }
      }
    ]

    const query = this.orderModel.aggregate(pipeline)

    if (limit && page) {
      query.skip((page - 1) * limit).limit(limit)
    }

    // query.sort(sort)

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

    const now = new Date()
    if (updateOrderDto.status === OrderStatus.Cooked) {
      updateOrderDto.cookingCompletedAt = now
    } else if (updateOrderDto.status === OrderStatus.Paid) {
      updateOrderDto.paidAt = now
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
