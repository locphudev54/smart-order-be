import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())

  const configService = app.get(ConfigService)
  const port = configService.get<number>('port')

  await app.listen(port)
}
bootstrap()
