import { SetMetadata } from '@nestjs/common'

export const IS_CUSTOMER_ROUTE = 'isCustomerRoute'
export const CustomerRoute = () => SetMetadata(IS_CUSTOMER_ROUTE, true)
