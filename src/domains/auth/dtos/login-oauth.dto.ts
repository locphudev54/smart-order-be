import { Transform } from 'class-transformer'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { SocialProvider } from 'core/constants/enum'

export class LoginOAuthDto {
  @IsEmail({}, { message: 'email không đúng định dạng' })
  @IsNotEmpty({ message: 'email không được  bỏ trống' })
  email: string

  @IsString({ message: 'imageUrl phải là kiểu dữ liệu là string' })
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  avatarUrl?: string

  @IsEnum(SocialProvider, {
    message: `provider phải là một trong những giá trị sau: ${Object.values(SocialProvider).join(' || ')}`
  })
  @IsNotEmpty({ message: 'provider không được bỏ trống' })
  provider: SocialProvider

  @IsString({ message: 'accessToken phải là kiểu dữ liệu là string' })
  @Transform(({ value }) => String(value).trim())
  @IsNotEmpty({ message: 'accessToken không được bỏ trống' })
  accessToken: string
}
