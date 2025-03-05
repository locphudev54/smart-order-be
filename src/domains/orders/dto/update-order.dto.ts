import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsEnum, IsOptional } from 'class-validator'
import { OrderStatus } from 'core/constants/enum'
import { CreateOrderDto } from 'domains/orders/dto/create-order.dto'

export class UpdateOrderDto extends OmitType(PartialType(CreateOrderDto), ['tableNumber', 'items']) {
  @IsEnum(OrderStatus, {
    message: `status phải là một trong những giá trị sau: ${Object.values(OrderStatus).join(' || ')}`
  })
  @IsOptional()
  status?: OrderStatus | undefined
}
