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
  IsUrl,
  MaxLength,
  MinLength
} from 'class-validator'
import { Role } from 'core/constants/enum'

export class CreateAccountDto {
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({ message: 'email không được  bỏ trống' })
  email: string

  @MaxLength(40, { message: 'password không được vượt quá 40 kí tự' })
  @MinLength(6, { message: 'password phải có ít nhất 6 kí tự' })
  @IsString({ message: 'password phải là định dạng string' })
  @IsNotEmpty({ message: 'password không được bỏ trống' })
  password: string

  @MaxLength(40, { message: 'fullname không được vượt quá 40 kí tự' })
  @MinLength(1, { message: 'password phải có ít nhất 1 kí tự' })
  @IsString({ message: 'fullname phải là định dạng string' })
  @IsNotEmpty({ message: 'fullname không được bỏ trống' })
  @Transform(({ value }) => value.trim())
  fullName: string

  @IsString({ message: 'imageUrl phải là định dạng string' })
  @IsOptional() // Tác dụng khi gọi API
  @Transform(({ value }) => value.trim())
  avatarUrl?: string // ? Tác dụng cho TS check

  // NOTE: VALIDATE ARRAY OF ENUM
  @ArrayUnique({ message: 'Các giá trị trong role phải khác nhau' })
  @IsEnum(Role, {
    each: true,
    message: `role phải chỉ gồm một trong những giá trị sau: ${Role.Customer} || ${Role.Chef} || ${Role.Manager} || ${Role.Waiter}`
  })
  @ArrayMinSize(1, { message: 'role phải có ít nhất một vai trò' })
  @IsArray({ message: 'role phải là một mảng các vai trò' })
  @IsOptional()
  role?: Role

  @IsString({ message: 'refreshToken phải là định dạng string' })
  @IsOptional()
  refreshToken?: string
}
