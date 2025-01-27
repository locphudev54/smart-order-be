import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { CustomerType } from 'core/types/type'
import { CustomersService } from 'domains/customers/customers.service'

@Injectable()
export class LocalCustomerStrategy extends PassportStrategy(Strategy, 'customer') {
  constructor(private customersService: CustomersService) {
    super({ usernameField: 'name', passwordField: 'tableToken' })
  }

  async validate(name: string, tableToken: string): Promise<CustomerType> {
    const customer = await this.customersService.validateCustomer(name, tableToken)
    // Gán vào req.user
    return { _id: customer._id, name: customer.name, tableNumber: customer.tableNumber }
  }
}
