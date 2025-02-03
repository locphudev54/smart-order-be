import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Customer, CustomerDocument } from 'domains/customers/schemas/customer.schema'
import { Model } from 'mongoose'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { CustomerTokenPayload, CustomerType, TableTokenPayload } from 'core/types/type'
import ms, { StringValue } from 'ms'
import { TablesService } from 'domains/tables/tables.service'
import { TableStatus } from 'core/constants/enum'
import { RefreshTokenDto } from 'domains/customers/dto/refresh-token.dto'
import { LogoutDto } from 'domains/customers/dto/logout.dto'
import { CreateOrderByCustomerDto } from 'domains/customers/dto/create-order-by-customer.dto'

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tablesService: TablesService
    // private readonly ordersService: OrdersService
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { tableNumber } = createCustomerDto
    const table = await this.tablesService.findTableByNumber(tableNumber)
    if (!table) {
      throw new BadRequestException('Bàn không tồn tại')
    }
    return this.customerModel.create(createCustomerDto)
  }

  createOrder(createOrderDto: CreateOrderByCustomerDto, customer: CustomerType) {}

  async findOne(id: string) {
    const customer = await this.customerModel.findOne({ _id: id })
    if (!customer) {
      throw new NotFoundException('Khách hàng không tồn tại')
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
    const { tableNumber } = await this.jwtService
      .verifyAsync<TableTokenPayload>(tableToken, {
        secret: this.configService.get('tableToken.secret')
      })
      .catch(() => {
        throw new BadRequestException('Vui lòng quét lại mã QR để đặt bàn')
      })

    const tableWithNumber = await this.tablesService.findTableByNumber(tableNumber)
    if (!tableWithNumber) {
      throw new BadRequestException('Bàn không tồn tại')
    }

    if (tableWithNumber.status !== TableStatus.Available) {
      throw new BadRequestException('Bàn này đã được đặt trước hoặc đang có khách sử dụng')
    }
    return this.customerModel.create({ name, tableId: tableWithNumber._id })
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
    await this.customerModel.updateOne({ refreshToken }, { refreshToken: '' })
    return 'Ok'
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto
      const customer = await this.findByRefreshToken(refreshToken)
      if (!customer || !refreshToken) {
        throw new UnauthorizedException('Refresh Token không hợp lệ')
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
        throw new UnauthorizedException('Refresh token hết hạn')
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
      const expiresIn = Math.ceil((new Date(exp * 1000).getTime() - new Date().getTime()) / 1000)
      return this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('customerRefreshToken.secret'),
        expiresIn
      })
    }
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('customerRefreshToken.secret'),
      expiresIn: ms(this.configService.get<StringValue>('customerRefreshToken.expiresIn')) / 1000
    })
  }
}
