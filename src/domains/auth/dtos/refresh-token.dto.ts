import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString({ message: 'refreshToken phải là định dạng string' })
  @IsNotEmpty({ message: 'refreshToken không được bỏ trống' })
  refreshToken: string
}
