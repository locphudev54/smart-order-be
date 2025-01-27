import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class LogoutDto {
  @IsString({ message: 'password phải là kiểu dữ liệu là string' })
  @IsNotEmpty({ message: 'password không được bỏ trống' })
  @Transform(({ value }) => value.trim())
  refreshToken: string
}
