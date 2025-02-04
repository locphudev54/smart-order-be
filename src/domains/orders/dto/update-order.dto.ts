import { PartialType } from '@nestjs/mapped-types'
import { IsMongoId, IsNotEmpty } from 'class-validator'
import { OrderItemDto } from 'domains/orders/dto/order-item.dto'
import { Types } from 'mongoose'

export class UpdateOrderDto extends PartialType(OrderItemDto) {
  @IsMongoId({ message: 'itemId phải là định dạng ObjectId' })
  @IsNotEmpty({ message: 'itemId không được bỏ trống' })
  itemId: Types.ObjectId
}
