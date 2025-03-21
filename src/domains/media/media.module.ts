import { Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MulterModule } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { MediaService } from './media.service'
import { JwtCustomerStrategy } from 'domains/customers/jwt-customer.strategy'
import { JwtEmployeeStrategy } from 'domains/auth/jwt-employee.strategy'
import { CloudinaryModule } from 'domains/cloudinary/cloudinary.module'
import { imageFileFilter } from 'domains/media/media-upload.utils'

@Module({
  imports: [CloudinaryModule],
  controllers: [MediaController],
  providers: [MediaService, JwtCustomerStrategy, JwtEmployeeStrategy]
})
export class MediaModule {}
