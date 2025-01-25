import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'
import { DishStatus } from 'core/constants/enum'

export class CreateDishDto {
  @MaxLength(40, { message: 'title không được vượt quá 40 kí tự' })
  @MinLength(2, { message: 'title phải có ít nhất 2 kí tự' })
  @IsString({ message: 'title phải là định dạng string' })
  @IsNotEmpty({ message: 'title không được  bỏ trống' })
  @Transform(({ value }) => value.trim())
  title: string

  @IsString({ message: 'description phải là định dạng string' })
  @IsNotEmpty({ message: 'description không được  bỏ trống' })
  @Transform(({ value }) => value.trim())
  description: string

  @Min(0, { message: 'price phải > 0' })
  @IsNumber({ allowNaN: false }, { message: 'price phải là định dạng số' })
  @IsNotEmpty({ message: 'price không được bỏ trống' })
  @Transform(({ value }) => Number(value))
  price: number

  @IsEnum(DishStatus, {
    message: `status phải là một trong những giá trị sau: ${DishStatus.Available} || ${DishStatus.Unavailable} || ${DishStatus.Hidden}`
  })
  @IsOptional()
  status?: DishStatus

  @IsString({ message: 'imageUrl phải là định dạng string' })
  @IsOptional() // Tác dụng khi gọi API
  @Transform(({ value }) => value.trim())
  imageUrl?: string // ? Tác dụng cho TS check
}
