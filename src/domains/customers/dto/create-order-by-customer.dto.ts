import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateOrderDto } from 'domains/orders/dto/create-order.dto'

export class CreateOrderByCustomerDto extends OmitType(PartialType(CreateOrderDto), ['customerId'] as const) {}
