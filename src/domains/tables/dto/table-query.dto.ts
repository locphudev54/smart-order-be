import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Min, MinLength } from 'class-validator'
import { OrderStatus } from 'core/constants/enum'

export class TableQueryDto {
  @MinLength(5, { message: 'sort phải có ít nhất 5 ký tự' })
  @IsString({ message: 'sort phải là định dạng chuỗi' })
  @Type(() => String)
  @IsOptional()
  sort?: string | undefined

  @IsPositive({ message: 'Số bàn không được âm' })
  @IsInt({ message: 'Số bàn phải là số nguyên' })
  @Type(() => Number)
  @IsOptional()
  number?: number | undefined
}
