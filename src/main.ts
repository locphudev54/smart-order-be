import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { ConfigService } from '@nestjs/config'
import { VersioningType } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import path from 'path'
import { customAlphabet } from 'nanoid'
import { OrderStatus } from 'core/constants/enum'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.use(helmet())

  const configService = app.get(ConfigService)
  const port = configService.get<number>('port')

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1'
  })

  /**
   * First parameter: đường dẫn đến thư mục mà mình muốn serve static
   * Second parameter: option object -> thêm prefix vào đường dẫn
   * -> khi truy cập vào: my_url/public/{đường dẫn còn lại dẫn đến file}
   */
  app.useStaticAssets(path.join(__dirname, '../upload'), {
    prefix: '/public/'
  })

  app.enableCors({ origin: '*' })

  await app.listen(port)
}
bootstrap()
