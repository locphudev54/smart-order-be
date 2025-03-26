import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateBillDto {
  @MaxLength(9, { message: 'customerCode phải có 9 kí tự' })
  @MinLength(9, { message: 'customerCode phải có 9 kí tự' })
  @IsString({ message: 'customerCode phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'customerCode không được  bỏ trống' })
  @Transform(({ value }) => String(value).trim())
  customerCode: string
}
