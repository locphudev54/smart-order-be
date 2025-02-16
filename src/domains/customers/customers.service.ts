import { forwardRef, Inject, Injectable } from '@nestjs/common'
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
import { LogoutDto } from 'domains/customers/dto/logout.dto'
import { CreateOrderByCustomerDto } from 'domains/customers/dto/create-order-by-customer.dto'
import { OrdersService } from 'domains/orders/orders.service'
import { BadRequestError, NotFoundError, UnauthorizedError } from 'core/exceptions/errors.exception'
import { generateCustomerCode } from 'core/utils/utils'

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tablesService: TablesService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { tableNumber, name } = createCustomerDto
    const table = await this.tablesService.findTableByNumber(tableNumber)

    if (!table) {
      throw new BadRequestError('Bàn không tồn tại')
    }
    if (table.status !== TableStatus.Available) {
      throw new BadRequestError('Bàn này đã được đặt trước hoặc đang có khách sử dụng')
    }
    const customerCode = generateCustomerCode()
    const [result] = await Promise.all([
      this.customerModel.create({ name, table: table._id, code: customerCode }),
      this.tablesService.update(table._id.toString(), { status: TableStatus.Occupied })
    ])

    return result
  }

  createOrder(createOrderDto: CreateOrderByCustomerDto, customer: CustomerType) {
    const { items } = createOrderDto
    const { _id: customerId } = customer
    return this.ordersService.create({ customerId: new Types.ObjectId(customerId), items })
  }

  async findOrders(customer: CustomerType) {
    return this.ordersService.findOneByCustomerId(customer._id)
  }

  async findOne(id: string) {
    const customer = await this.customerModel
      .findOne({ _id: id })
      .populate({
        path: 'table',
        select: ['_id', 'number', 'capacity', 'status']
      })
      .select(['-refreshToken'])
    if (!customer) {
      throw new NotFoundError('Khách hàng không tồn tại')
    }
    return customer
  }

  findByRefreshToken(refreshToken: string) {
    return this.customerModel.findOne({ refreshToken })
  }

  // ----------------- AUTH SERVICES ----------------------
  async validateCustomer(name: string, tableToken: string) {
    // Mục đích chính của việc validate khách hàng là kiểm tra xem tableToken gửi lên có hợp lệ hay không
    // Còn việc ktra tính duy nhất của tên khách hàng là không cần thiết
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

    if (table.status !== TableStatus.Available) {
      throw new BadRequestError('Bàn này đã được đặt trước hoặc đang có khách sử dụng')
    }
    const customerCode = generateCustomerCode()
    const [result] = await Promise.all([
      this.customerModel.create({ name, table: table._id, code: customerCode }),
      this.tablesService.update(table._id.toString(), { status: TableStatus.Occupied })
    ])

    return result
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

    await Promise.all([
      this.customerModel.updateOne({ refreshToken }, { refreshToken: '' }),
      this.tablesService.update(customer.table.toString(), { status: TableStatus.Available })
    ])
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto
      const customer = await this.findByRefreshToken(refreshToken)
      if (!customer || !refreshToken) {
        throw new UnauthorizedError('Refresh Token không hợp lệ')
      }

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
        throw new UnauthorizedError('Refresh Token hết hạn')
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
}
