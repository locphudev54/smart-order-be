import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'
import { Role } from 'core/constants/enum'

export class CreateAccountDto {
  @ApiProperty({})
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({ message: 'email không được  bỏ trống' })
  email: string

  @ApiProperty()
  @MaxLength(40, { message: 'password không được vượt quá 40 kí tự' })
  @MinLength(6, { message: 'password phải có ít nhất 6 kí tự' })
  @IsString({ message: 'password phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'password không được bỏ trống' })
  @Transform(({ value }) => String(value).trim())
  password: string

  @ApiProperty()
  @MaxLength(40, { message: 'fullname không được vượt quá 40 kí tự' })
  @MinLength(1, { message: 'password phải có ít nhất 1 kí tự' })
  @IsString({ message: 'fullname phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'fullname không được bỏ trống' })
  @Transform(({ value }) => String(value).trim())
  fullName: string

  @ApiProperty()
  @IsString({ message: 'imageUrl phải là kiểu dữ liệu là string' })
  @IsOptional() // Tác dụng khi gọi API
  @Transform(({ value }) => String(value).trim())
  avatarUrl?: string // ? Tác dụng cho DEV nhận biết

  @ApiPropertyOptional({ enum: [Role.Waiter, Role.Chef, Role.Manager] })
  @IsEnum(Role, {
    message: `role phải là một trong những giá trị sau: ${Role.Chef} || ${Role.Manager} || ${Role.Manager}`
  })
  @IsOptional()
  role?: Role
}
