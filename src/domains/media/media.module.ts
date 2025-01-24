import { Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { MulterModule } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('multerDest')
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
