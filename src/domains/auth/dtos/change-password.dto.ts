import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class ChangePasswordDto {
  @MaxLength(40, { message: 'olPassword không được vượt quá 40 kí tự' })
  @MinLength(6, { message: 'olPassword phải có ít nhất 6 kí tự' })
  @IsString({ message: 'olPassword phải là định dạng string' })
  @IsNotEmpty({ message: 'olPassword không được bỏ trống' })
  oldPassword: string

  @MaxLength(40, { message: 'password không được vượt quá 40 kí tự' })
  @MinLength(6, { message: 'ppssword phải có ít nhất 6 kí tự' })
  @IsString({ message: 'password phải là định dạng string' })
  @IsNotEmpty({ message: 'password không được bỏ trống' })
  password: string
}
