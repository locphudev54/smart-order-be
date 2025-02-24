import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateOrderDto } from 'domains/orders/dto/create-order.dto'

export class UpdateOrderDto extends OmitType(PartialType(CreateOrderDto), ['customer', 'items']) {}
