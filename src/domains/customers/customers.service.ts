import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Customer, CustomerDocument } from 'domains/customers/schemas/customer.schema'
import { Model, Types } from 'mongoose'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { CustomerTokenPayload, CustomerType, TableTokenPayload } from 'core/types/type'
import ms, { StringValue } from 'ms'
import { TablesService } from 'domains/tables/tables.service'
import { TableStatus } from 'core/constants/enum'
import { RefreshTokenDto } from 'domains/customers/dto/refresh-token.dto'
import { OrdersService } from 'domains/orders/orders.service'
import { BadRequestError, NotFoundError, UnauthorizedError } from 'core/exceptions/errors.exception'
import { generateCustomerCode } from 'core/utils/utils'
import { CreateOrderDto } from 'domains/orders/dto/create-order.dto'
import { CreateOrderByCustomerDto } from 'domains/customers/dto/create-order-by-customer.dto'
import { TableDocument } from 'domains/tables/schemas/table.schema'
import { Request, Response } from 'express'
import { LogoutDto } from 'domains/customers/dto/logout.dto'

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tablesService: TablesService
  ) {}

  // async create(createCustomerDto: CreateCustomerDto) {
  async create({ table }: { table: TableDocument }) {
    // Không cần kiểm tra ở đây - vì function tạo mới khách hàng chỉ được sử dụng ở bên hàm tạo mới đơn hàng
    // Mà bên hàm tạo mới đơn hàng đã tìm và kiểm tra tính hợp  lệ của bàn đó rồi
    // const { tableNumber } = createCustomerDto
    // const table = await this.tablesService.findByTableNumber(tableNumber)

    if (table.status !== TableStatus.Available || table.customer) {
      throw new BadRequestError('Bàn này đã được đặt trước hoặc đang có khách sử dụng')
    }
    const customerCode = generateCustomerCode()
    const newCustomer = await this.customerModel.create({ tableNumber: table.number, code: customerCode })
    await this.tablesService.update(table.id, { status: TableStatus.Occupied, customer: newCustomer._id })

    return newCustomer
  }

  createOrder(createOrderDto: CreateOrderByCustomerDto, customer: CustomerType) {
    const { items } = createOrderDto
    return this.ordersService.create({ tableNumber: customer.tableNumber, items }, true)
  }

  async findOrders(customer: CustomerType) {
    return this.ordersService.findAll({ customerCode: customer.code })
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findOne({ _id: id }).select(['-refreshToken'])
    if (!customer) {
      throw new NotFoundError('Khách hàng không tồn tại')
    }
    return customer
  }

  findByRefreshToken(refreshToken: string) {
    return this.customerModel.findOne({ refreshToken })
  }

  findByCode(code: string) {
    return this.customerModel.findOne({ code })
  }

  removeRefreshToken(id: string) {
    return this.customerModel.updateOne({ _id: id }, { refreshToken: '' })
  }

  // ----------------- CUSTOMER AUTH SERVICES ----------------------
  async validateCustomer(tableToken: string) {
    // Mục đích chính của việc validate khách hàng là kiểm tra xem tableToken gửi lên có hợp lệ hay không
    await this.jwtService
      .verifyAsync<TableTokenPayload>(tableToken, {
        secret: this.configService.get('tableToken.secret')
      })
      .catch(() => {
        throw new BadRequestError('Vui lòng quét lại mã QR để đặt bàn')
      })

    const table = await this.tablesService.findTableByToken(tableToken)
    if (!table) {
      throw new BadRequestError('Bàn không tồn tại')
    }

    if (table.status !== TableStatus.Available || table.customer) {
      throw new BadRequestError('Bàn này đã được đặt trước hoặc đang có khách sử dụng')
    }

    const customerCode = generateCustomerCode()
    const newUser = await this.customerModel.create({ tableNumber: table.number, code: customerCode })
    await this.tablesService.update(table._id.toString(), { status: TableStatus.Occupied, customer: newUser._id })
    return newUser
  }

  async login(customer: CustomerType) {
    const payload = customer
    const [accessToken, refreshToken] = await Promise.all([
      this.signCustomerAccessToken(payload),
      this.signCustomerRefreshToken(payload)
    ])

    await this.customerModel.updateOne({ _id: customer._id }, { refreshToken })
    return {
      accessToken,
      refreshToken,
      customer
    }
  }
  async logout(logoutDto: LogoutDto) {
    const { refreshToken } = logoutDto
    const customer = await this.customerModel.findOne({ refreshToken })
    if (!customer) {
      throw new BadRequestError('Refresh Token không hợp lệ')
    }
    const table = await this.tablesService.findByTableNumber(customer.tableNumber)
    const tableId = table._id.toString()

    this.customerModel.updateOne({ refreshToken }, { refreshToken: '' })
    this.tablesService.update(tableId, { status: TableStatus.Available, customer: null })
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    let customerId: undefined | string = undefined
    try {
      const { refreshToken } = refreshTokenDto
      const customer = await this.findByRefreshToken(refreshToken)
      if (!customer || !refreshToken) {
        throw new UnauthorizedError('INVALID_REFRESH_TOKEN')
      }

      customerId = customer._id.toString()
      const decodedOldRefreshToken = await this.jwtService.verifyAsync<CustomerTokenPayload>(refreshToken, {
        secret: this.configService.get<string>('customerRefreshToken.secret')
      })

      const { iat, exp, ...payload } = decodedOldRefreshToken
      const [accessToken, newRefreshToken] = await Promise.all([
        this.signCustomerAccessToken(payload),
        this.signCustomerRefreshToken(payload, decodedOldRefreshToken.exp)
      ])
      await this.customerModel.updateOne({ _id: customer._id }, { refreshToken: newRefreshToken })

      return {
        accessToken,
        refreshToken: newRefreshToken,
        account: payload
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        if (customerId) {
          this.customerModel.updateOne({ _id: customerId }, { refreshToken: '' })
        }
        throw new UnauthorizedError('REFRESH_TOKEN_EXPIRED')
      }
      throw error
    }
  }

  signCustomerAccessToken(payload: CustomerType) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('customerAccessToken.secret'),
      expiresIn: ms(this.configService.get<StringValue>('customerAccessToken.expiresIn')) / 1000
    })
  }

  signCustomerRefreshToken(payload: CustomerType, exp?: number) {
    if (exp) {
      return this.jwtService.signAsync(
        { ...payload, exp },
        {
          secret: this.configService.get<string>('customerRefreshToken.secret')
        }
      )
    }
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('customerRefreshToken.secret'),
      expiresIn: ms(this.configService.get<StringValue>('customerRefreshToken.expiresIn')) / 1000
    })
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return this.customerModel.updateOne({ _id: id }, { refreshToken })
  }
}
