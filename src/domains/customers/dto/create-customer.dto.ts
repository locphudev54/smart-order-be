import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, Min } from 'class-validator'

export class CreateCustomerDto {
  @Min(1, { message: 'tableNumber phải > 0' })
  @IsInt({ message: 'tableNumber phải là định dạng số nguyên' })
  @IsNotEmpty({ message: 'tableNumber không được bỏ trống' })
  @Transform(({ value }) => Number(value))
  tableNumber: number
}
