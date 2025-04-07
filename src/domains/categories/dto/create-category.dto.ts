import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'

export class CreateCategoryDto {
  @MaxLength(40, { message: 'title không được vượt quá 40 kí tự' })
  @MinLength(2, { message: 'title phải có ít nhất 2 kí tự' })
  @IsString({ message: 'title phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'title không được  bỏ trống' })
  @Transform(({ value }) => String(value).trim())
  title: string
}
