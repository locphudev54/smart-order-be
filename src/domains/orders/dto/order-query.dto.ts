import { Transform, Type } from 'class-transformer'
import { ArrayMinSize, IsEnum, IsInt, IsMongoId, IsOptional, IsPositive, IsString, MinLength } from 'class-validator'
import { OrderStatus } from 'core/constants/enum'
import { IsUniqueArray } from 'core/decorators/is-unique-array.decorator'
import { Types } from 'mongoose'

export class OrderQueryDto {
  @MinLength(5, { message: 'sort phải có ít nhất 5 ký tự' })
  @IsString({ message: 'sort phải là định dạng chuỗi' })
  @Type(() => String)
  @IsOptional()
  sort?: string | undefined

  @MinLength(1, { message: 'code phải có ít nhất 1 ký tự' })
  @IsString({ message: 'code phải là định dạng chuỗi' })
  @Type(() => String)
  @Transform(({ value }) => String(value).trim())
  @IsOptional()
  code?: string | undefined

  @MinLength(1, { message: 'customerCode phải có ít nhất 1 ký tự' })
  @IsString({ message: 'customerCode phải là định dạng chuỗi' })
  @Transform(({ value }) => String(value).trim())
  @Type(() => String)
  @IsOptional()
  customerCode?: string | undefined

  // NOTE: VALIDATE ARRAY OF ENUM
  @IsUniqueArray('Các phần tử trong status không được trùng lặp')
  @IsEnum(OrderStatus, {
    each: true,
    message: `status phải là một trong những giá trị sau: ${Object.values(OrderStatus).join(' || ')} và được ngăn cách bằng dấu ,`
  })
  @Transform(({ value }: { value: string }) => value.split(',').map((v) => v.trim()))
  @IsOptional()
  status?: OrderStatus[] | undefined

  @IsUniqueArray('Các phần tử trong tableNumber không được trùng lặp')
  @IsPositive({ each: true, message: 'tableNumber phải chứa các số bàn > 0' })
  @IsInt({
    each: true,
    message: `tableNumber phải là chuỗi gồm các số nguyên và được ngăn cách bằng dấu ,`
  })
  @ArrayMinSize(1, { message: 'tableNumber phải có ít nhất một số bàn' })
  @Transform(({ value }: { value: string }) =>
    value
      .split(',')
      .filter((v) => Boolean(v) && v.trim().length > 0)
      .map((v) => Number(v))
  )
  @IsOptional()
  tableNumber?: number[] | undefined

  @IsMongoId({ message: 'customerId phải là định dạng ObjectId' })
  @IsOptional()
  customerId?: string | undefined

  // NOTE: VALIDATE ARRAY OF ENUM
  // @IsEnum(OrderStatus, {
  //   each: true,
  //   message: `Các phần tử trong status phải là một trong những giá trị sau: ${Object.values(OrderStatus).join(' || ')}`
  // })
  // @ArrayMinSize(1, { message: 'status phải có ít nhất một phần tử' })
  // @IsArray({ message: 'status phải là định dạng mảng' })
  // @IsOptional()
  // status?: OrderStatus[] | undefined
}
