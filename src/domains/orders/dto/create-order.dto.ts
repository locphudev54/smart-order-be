import { Transform, Type } from 'class-transformer'
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { OrderStatus } from 'core/constants/enum'
import { OrderItemDto } from 'domains/orders/dto/order-item.dto'

export class CreateOrderDto {
  @IsInt({ message: 'tableNumber phải là định dạng số nguyên' })
  @IsNotEmpty({ message: 'tableNumber không được bỏ trống' })
  @Type(() => Number)
  tableNumber: number

  // NOTE: VALIDATE ARRAY OF NESTED OBJECT
  @Type(() => OrderItemDto)
  @ValidateNested({ each: true, message: 'Các phần tử trong items không đúng định dạng' })
  @ArrayMinSize(1, { message: 'items phải có ít nhất một món ăn' })
  @IsArray({ message: 'items phải là định dạng mảng' })
  @IsNotEmpty({ message: 'items không được bỏ trống' })
  items: OrderItemDto[]
}
