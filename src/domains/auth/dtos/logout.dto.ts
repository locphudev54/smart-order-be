import { IsNotEmpty, IsString } from 'class-validator'

export class LogoutDto {
  @IsString({ message: 'password phải là định dạng string' })
  @IsNotEmpty({ message: 'password không được bỏ trống' })
  refreshToken: string
}
