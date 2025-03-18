import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'email không hợp lệ' })
  @IsNotEmpty({ message: 'email không được  bỏ trống' })
  email: string

  @MinLength(8, { message: 'password phải có ít nhất 9 ký tự' })
  @IsNotEmpty({ message: 'password không được để trống' })
  password: string
}
