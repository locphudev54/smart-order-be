import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'
import { Types } from 'mongoose'

export class OrderItemDto {
  @IsMongoId({ message: 'dish phải là định dạng ObjectId' })
  @IsNotEmpty({ message: 'dish không được bỏ trống' })
  dish: Types.ObjectId

  @Min(1, { message: 'quantity phải > 0' })
  @IsInt({ message: 'quantity phải là định dạng số nguyên' })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty({ message: 'quantity không được bỏ trống' })
  quantity: number

  @Min(1, { message: 'price phải > 0' })
  @IsNumber({ allowNaN: false }, { message: 'price phải là định dạng số' })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty({ message: 'price không được bỏ trống' })
  price: number

  @MaxLength(100, { message: 'note không được vượt quá 100 kí tự' })
  @IsString({ message: 'note phải là kiểu dữ liệu là string' })
  @Transform(({ value }) => String(value).trim())
  @IsOptional()
  note: string
}
