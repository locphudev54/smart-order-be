import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Order, OrderDocument } from 'domains/orders/schemas/order.schema'
import { Model } from 'mongoose'
import { CustomersService } from 'domains/customers/customers.service'
import { OrderItem } from 'domains/orders/schemas/order-item.schema'
import { TablesService } from 'domains/tables/tables.service'
import { NotFoundError } from 'core/exceptions/errors.exception'
import { generateOrderCode } from 'core/utils/utils'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,
    private readonly tablesService: TablesService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customer: customerId, items } = createOrderDto
    const customer = await this.customersService.findOne(customerId.toString())
    const tableId = customer.table._id

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
        table: tableId,
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

  async findAll(page?: number, limit?: number, from?: Date, to?: Date) {
    const filter: any = {}
    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = from
      if (to) filter.createdAt.$lt = to
    }

    const query = this.orderModel
      .find(filter)
      .populate([
        { path: 'customer', select: ['_id', 'name'] },
        { path: 'items.dish' },
        { path: 'table', select: ['-token', '-reservationLink'] }
      ])

    if (limit && page) {
      query.limit(limit).skip((page - 1) * limit)
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
