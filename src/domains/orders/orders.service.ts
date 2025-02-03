import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Order, OrderDocument } from 'domains/orders/schemas/order.schema'
import { Model } from 'mongoose'
import aqp from 'api-query-params'
import { CustomersService } from 'domains/customers/customers.service'
import { QueryType } from 'core/types/type'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly customersService: CustomersService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customerId, items, status } = createOrderDto
    const customer = await this.customersService.findOne(customerId.toString())
    const { tableId } = customer

    const totalPrice = items.reduce((result, orderItem) => {
      return result + orderItem.price * orderItem.quantity
    }, 0)
    return this.orderModel.create({ customerId: customer._id, items, status, tableId, totalPrice })
  }

  async findAll(qs: QueryType) {
    const page = Number(qs.page) || 1
    const limit = Number(qs.limit) || 10
    delete qs.page
    delete qs.limit

    const skip = (page - 1) * limit
    const { filter, sort, projection, population } = aqp(qs)

    const [result, totalDocument] = await Promise.all([
      this.orderModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort as any)
        .select(projection)
        .populate(population), // look up đến Customer & DishSnapShot Collection & Table Collection
      this.orderModel.find(filter)
    ])
    const totalPage = Math.ceil(totalDocument.length / result.length)

    return {
      data: result,
      meta: {
        page,
        limit: result.length,
        totalPage
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`
  }

  remove(id: number) {
    return `This action removes a #${id} order`
  }
}
