import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator'
import { TableStatus } from 'core/constants/enum'

export class CreateTableDto {
  @Min(1, { message: 'number phải > 0' })
  @IsInt({ message: 'number phải là định dạng số nguyên' })
  @IsNotEmpty({ message: 'number không được bỏ trống' })
  @Transform(({ value }) => Number(value))
  number: number

  // @Min(1, { message: 'capacity phải > 0' })
  // @IsInt({ message: 'capacity phải là định dạng số nguyên' })
  // @IsNotEmpty({ message: 'capacity không được bỏ trống' })
  // @Transform(({ value }) => Number(value))
  // capacity: number

  @IsEnum(TableStatus, {
    message: `status phải là một trong những giá trị sau: ${Object.values(TableStatus).join(' || ')}`
  })
  @IsOptional()
  status?: TableStatus
}
