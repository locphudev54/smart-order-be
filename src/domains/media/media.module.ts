import { Module } from '@nestjs/common'
import { JwtEmployeeStrategy } from 'domains/auth/jwt-employee.strategy'
import { CloudinaryModule } from 'domains/cloudinary/cloudinary.module'
import { JwtCustomerStrategy } from 'domains/customers/jwt-customer.strategy'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'

@Module({
  imports: [CloudinaryModule],
  controllers: [MediaController],
  providers: [MediaService, JwtCustomerStrategy, JwtEmployeeStrategy]
})
export class MediaModule {}
