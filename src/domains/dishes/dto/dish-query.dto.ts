import { Type } from 'class-transformer'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class DishQueryDto {
  @MinLength(5, { message: 'sort phải có ít nhất 5 ký tự' })
  @IsString({ message: 'sort phải là định dạng chuỗi' })
  @Type(() => String)
  @IsOptional()
  sort?: string | undefined

  @IsString()
  @IsOptional()
  keyword?: string | undefined
}
