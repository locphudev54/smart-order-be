import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'
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
  @IsString({ message: 'fullname phải là định dạng string' })
  @IsNotEmpty({ message: 'fullname không được bỏ trống' })
  fullName: string

  @IsUrl(undefined, { message: 'avatarUrl phải là định dạng URL' })
  @IsOptional() // Tác dụng khi gọi API
  avatarUrl?: string // ? Tác dụng cho TS check

  // NOTE: VALIDATE ENUM
  @IsEnum(Role, {
    message: `role phải là một trong những giá trị sau: ${Role.Customer} || ${Role.Chef} || ${Role.Manager} || ${Role.Waiter}`
  })
  @IsOptional()
  role?: Role

  @IsString({ message: 'refreshToken phải là định dạng string' })
  @IsOptional()
  refreshToken?: string
}
