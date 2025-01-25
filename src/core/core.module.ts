import { Module, UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Joi from 'joi'
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { database, environment, port, token, upload } from 'config'
import { TransformResponseInterceptor } from 'core/interceptors/transform-response.interceptor'
import { JwtAuthGuard } from 'core/guards/jwt-auth.guard'
import { ValidationError } from 'class-validator'
import { RolesGuard } from 'core/guards/roles.guard'
import { CaslModule } from './casl/casl.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment, port, database, token, upload],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').required(),
        PORT: Joi.number().port().required(),
        DATABASE_URI: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        MULTER_DEFAULT_DEST: Joi.string().required()
      })
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('databaseUri')
      }),
      inject: [ConfigService]
    }),
    CaslModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new UnprocessableEntityException(
            validationErrors.map((error) => ({
              field: error.property,
              message: Object.values(error.constraints).join(', ')
            }))
          )
        }
      })
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  exports: []
})
export class CoreModule {}
