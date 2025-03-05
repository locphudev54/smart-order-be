import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString, Min, MinLength } from 'class-validator'
import { OrderStatus } from 'core/constants/enum'

export class AccountQueryDto {
  @MinLength(5, { message: 'sort phải có ít nhất 5 ký tự' })
  @IsString({ message: 'sort phải là định dạng chuỗi' })
  @Type(() => String)
  @IsOptional()
  sort?: string | undefined

  @MinLength(1, { message: 'code phải có ít nhất 1 ký tự' })
  @IsString({ message: 'code phải là định dạng chuỗi' })
  @Type(() => String)
  @IsOptional()
  code?: string | undefined

  @MinLength(1, { message: 'customerCode phải có ít nhất 1 ký tự' })
  @IsString({ message: 'customerCode phải là định dạng chuỗi' })
  @Type(() => String)
  @IsOptional()
  customerCode?: string | undefined

  @IsEnum(OrderStatus, {
    message: `status phải là một trong những giá trị sau: ${Object.values(OrderStatus).join(' || ')}`
  })
  @IsOptional()
  status?: OrderStatus | undefined
}
