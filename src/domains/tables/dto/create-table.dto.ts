import { Transform } from 'class-transformer'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator'
import { TableStatus } from 'core/constants/enum'

export class CreateTableDto {
  @Min(0, { message: 'number phải > 0' })
  @IsInt({ message: 'number phải là định dạng số nguyên' })
  @IsNotEmpty({ message: 'number không được bỏ trống' })
  @Transform(({ value }) => Number(value))
  number: number

  @Min(0, { message: 'capacity phải > 0' })
  @IsInt({ message: 'capacity phải là định dạng số nguyên' })
  @IsNotEmpty({ message: 'capacity không được bỏ trống' })
  @Transform(({ value }) => Number(value))
  capacity: number

  @IsEnum(TableStatus, {
    message: `status phải là một trong những giá trị sau: ${TableStatus.Available} || ${TableStatus.Hidden} || ${TableStatus.Occupied} || ${TableStatus.Reserved}`
  })
  @IsOptional()
  status?: TableStatus
  // @IsString({ message: 'reservationLink phải là kiểu dữ liệu là string' })
  // @IsNotEmpty({ message: 'reservationLink không được  bỏ trống' })
  // @Transform(({ value }) => value.trim())
  // reservationLink: string

  // @IsString({ message: 'token phải là kiểu dữ liệu là string' })
  // @IsNotEmpty({ message: 'token không được  bỏ trống' })
  // @Transform(({ value }) => value.trim())
  // token: string
}
