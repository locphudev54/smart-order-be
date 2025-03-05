import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { CustomerType, TableTokenPayload } from 'core/types/type'
import { CustomersService } from 'domains/customers/customers.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class LocalCustomerStrategy extends PassportStrategy(Strategy, 'local-customer') {
  constructor(
    private customersService: CustomersService,
    private readonly jwtService: JwtService
  ) {
    super({ usernameField: 'name', passwordField: 'tableToken' })
  }

  async validate(name: string, tableToken: string): Promise<CustomerType> {
    const customer = await this.customersService.validateCustomer(name, tableToken)
    const decodedTableToken = this.jwtService.decode<TableTokenPayload>(tableToken)
    // Gán vào req.user
    return { _id: customer._id.toString(), table: decodedTableToken.tableNumber }
  }
}
