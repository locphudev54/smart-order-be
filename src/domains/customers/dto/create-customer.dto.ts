import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from 'class-validator'

export class CreateCustomerDto {
  @MaxLength(40, { message: 'name không được vượt quá 40 kí tự' })
  @MinLength(2, { message: 'name phải có ít nhất 2 kí tự' })
  @IsString({ message: 'name phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'name không được  bỏ trống' })
  @Transform(({ value }) => value.trim())
  name: string

  @Min(0, { message: 'tableNumber phải > 0' })
  @IsInt({ message: 'tableNumber phải là định dạng số nguyên' })
  @IsNotEmpty({ message: 'tableNumber không được bỏ trống' })
  @Transform(({ value }) => Number(value))
  tableNumber: number
}
