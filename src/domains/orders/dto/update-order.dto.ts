import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsOptional } from 'class-validator'
import { OrderStatus } from 'core/constants/enum'

export class UpdateOrderDto {
  @IsEnum(OrderStatus, {
    message: `status phải là một trong những giá trị sau: ${Object.values(OrderStatus).join(' || ')}`
  })
  @IsOptional()
  status?: OrderStatus | undefined

  @IsDate({ message: 'paidAt phải là định dạng ngày' })
  @Type(() => Date)
  @IsOptional()
  paidAt?: Date | undefined

  @IsDate({ message: 'cookingCompletedAt phải là định dạng ngày' })
  @Type(() => Date)
  @IsOptional()
  cookingCompletedAt?: Date | undefined
}
