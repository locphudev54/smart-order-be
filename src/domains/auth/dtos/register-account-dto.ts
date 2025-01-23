import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterAccountDto {
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
}
