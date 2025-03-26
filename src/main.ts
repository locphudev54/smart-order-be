import { VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import path from 'path'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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

  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('Smart Order')
    .setDescription('The Smart Order API description')
    .setVersion('1.0')
    .addTag('Pham Phu Loc')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/json'
  })

  await app.listen(port)
}
bootstrap()
