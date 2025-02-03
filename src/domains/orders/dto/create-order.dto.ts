import { Type } from 'class-transformer'
import { ArrayMinSize, IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { OrderStatus } from 'core/constants/enum'
import { OrderItemDto } from 'domains/orders/dto/order-item.dto'
import { Types } from 'mongoose'

export class CreateOrderDto {
  @IsMongoId({ message: 'customerId phải là định dạng ObjectId' })
  @IsNotEmpty({ message: 'customerId không được bỏ trống' })
  customerId: Types.ObjectId

  // NOTE: VALIDATE ARRAY OF NESTED OBJECT
  @Type(() => OrderItemDto)
  @ValidateNested({ each: true, message: 'các phần tử trong items không đúng định dạng' })
  @ArrayMinSize(1, { message: 'items phải có ít nhất một món ăn' })
  @IsArray({ message: 'items phải là định dạng mảng' })
  @IsNotEmpty({ message: 'items không được bỏ trống' })
  items: OrderItemDto[]

  @IsEnum(OrderStatus, {
    message: `status phải là một trong những giá trị sau: ${OrderStatus.Canceled} || ${OrderStatus.Cooked} || ${OrderStatus.Paid} || ${OrderStatus.Processing} || ${OrderStatus.Rejected} || ${OrderStatus.Served}`
  })
  @IsOptional()
  status?: OrderStatus

  @IsMongoId({ message: 'tableId phải là định dạng ObjectId' })
  @IsNotEmpty({ message: 'tableId không được bỏ trống' })
  tableId: Types.ObjectId
}
