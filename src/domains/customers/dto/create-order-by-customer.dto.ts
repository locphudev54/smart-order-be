import { OmitType } from '@nestjs/mapped-types'
import { CreateOrderDto } from 'domains/orders/dto/create-order.dto'

export class CreateOrderByCustomerDto extends OmitType(CreateOrderDto, ['customer'] as const) {}
