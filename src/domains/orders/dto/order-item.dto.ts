import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'
import { OrderStatus } from 'core/constants/enum'
import { Types } from 'mongoose'

export class OrderItemDto {
  @IsMongoId({ message: 'dish phải là định dạng ObjectId' })
  @IsNotEmpty({ message: 'dish không được bỏ trống' })
  dish: Types.ObjectId

  @Min(1, { message: 'quantity phải > 0' })
  @IsInt({ message: 'quantity phải là định dạng số nguyên' })
  @IsNotEmpty({ message: 'quantity không được bỏ trống' })
  @Transform(({ value }) => Number(value))
  quantity: number

  @Min(1, { message: 'price phải > 0' })
  @IsNumber({ allowNaN: false }, { message: 'price phải là định dạng số' })
  @IsNotEmpty({ message: 'price không được bỏ trống' })
  @Transform(({ value }) => Number(value))
  price: number

  @MaxLength(100, { message: 'note không được vượt quá 100 kí tự' })
  @IsString({ message: 'note phải là kiểu dữ liệu là string' })
  @Transform(({ value }) => String(value).trim())
  @IsOptional()
  note: string
}
