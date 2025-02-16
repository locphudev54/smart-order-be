import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Order, OrderDocument } from 'domains/orders/schemas/order.schema'
import { Model } from 'mongoose'
import aqp from 'api-query-params'
import { CustomersService } from 'domains/customers/customers.service'
import { QueryType } from 'core/types/type'
import { OrderItem } from 'domains/orders/schemas/order-item.schema'
import { OrderStatus, TableStatus } from 'core/constants/enum'
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
    const { customerId, items } = createOrderDto
    const customer = await this.customersService.findOne(customerId.toString())
    const tableId = customer.table._id

    const orderItems: OrderItem[] = items.map((item) => {
      const { dishId, ...rest } = item
      return {
        dish: dishId,
        ...rest
      }
    })

    let totalPrice = items.reduce((result, orderItem) => {
      return result + orderItem.price * orderItem.quantity
    }, 0)

    const previousOrder = await this.orderModel.findOne({ customer: customerId })
    if (!previousOrder) {
      // TH1: Lần đầu đặt món ăn -> Tạo mới Order như bình thường
      const orderCode = generateOrderCode()
      return this.orderModel.create({
        customer: customer._id,
        items: orderItems,
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
            items: orderItems
          },
          totalPrice
        },
        {
          returnOriginal: false
        }
      )
    }
  }

  async findAll(qs: QueryType) {
    const page = Number(qs.page) || 1
    const limit = Number(qs.limit) || 10
    delete qs.page
    delete qs.limit

    const skip = (page - 1) * limit
    const { filter, sort, projection } = aqp(qs)

    const [result, totalDocument] = await Promise.all([
      this.orderModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort as any)
        .select(projection)
        .populate([
          { path: 'customer', select: ['_id', 'name'] },
          { path: 'items.dish' },
          {
            path: 'table',
            select: ['-token', '-reservationLink']
          }
        ]),
      this.orderModel.find(filter)
    ])
    const totalPages = Math.ceil(totalDocument.length / result.length)

    return {
      data: result,
      meta: {
        page,
        limit: result.length,
        totalPages
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
      return []
    }
    return order
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { itemId } = updateOrderDto
    const order = await this.findOne(id)
    if (!order) {
      throw new NotFoundError('Đơn hàng không tồn tại')
    }

    // Tạo ra OrderItem mới & Tính toán lại `totalPrice` dựa trên OrdetItem cũ và DTO
    const targetItem = order.items.find((item) => item.id === itemId)
    if (!targetItem) {
      throw new NotFoundError('OrderItem với itemId gửi lên không tồn tại')
    }
    const updatedItem = { ...targetItem.toObject(), ...updateOrderDto, updatedAt: new Date() }

    // Cập nhật lại trạng thái của Table khi các OrderItem đã được hoàn thành
    const isOrderCompleted = order.items.every((item) => [OrderStatus.Paid, OrderStatus.Rejected].includes(item.status))
    if (isOrderCompleted) {
      await this.tablesService.update(order.table.toString(), { status: TableStatus.Available })
    } else {
      await this.tablesService.update(order.table.toString(), { status: order.table.status })
    }

    return this.orderModel.findOneAndUpdate(
      {
        _id: id,
        'items._id': itemId
      },
      {
        $set: {
          'items.$': updatedItem
        }
      },
      {
        returnOriginal: false
      }
    )
  }
}
