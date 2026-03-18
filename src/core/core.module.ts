import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Joi from 'joi'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { client, database, environment, port, server, token, upload } from 'config'
import { TransformResponseInterceptor } from 'core/interceptors/transform-response.interceptor'
import { ValidationError } from 'class-validator'
import { CaslModule } from './casl/casl.module'
import { extractErrorMessageFromDto } from 'core/utils/utils'
import { JwtEmployeeAuthGuard } from 'core/guards/jwt-employee-auth.guard'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'
import AnyExceptionFilter from 'core/exceptions/any-exception-filter'
import { RolesGuard } from 'core/guards/roles.guard'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ApiKeyGuard } from 'core/guards/api-key.guard'

@Module({
  imports: [
    // ThrottlerModule.forRoot({
    //   throttlers: [
    //     {
    //       ttl: 1000,
    //       limit: 2
    //     }
    //     // {
    //     //   name: 'short',
    //     //   ttl: 1000,
    //     //   limit: 2
    //     // },
    //     // {
    //     //   name: 'medium',
    //     //   ttl: 10000,
    //     //   limit: 20
    //     // },
    //     // {
    //     //   name: 'long',
    //     //   ttl: 60000,
    //     //   limit: 100
    //     // }
    //   ]
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment, port, database, token, upload, client, server],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').required(),
        PORT: Joi.number().port().required(),
        DEVELOPMENT_DATABASE_URI: Joi.string().required(),
        EMPLOYEE_ACCESS_TOKEN_SECRET: Joi.string().required(),
        EMPLOYEE_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMPLOYEE_REFRESH_TOKEN_SECRET: Joi.string().required(),
        EMPLOYEE_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        MULTER_DEFAULT_DEST: Joi.string().required(),
        CLIENT_BASE_URL: Joi.string().required(),
        TABLE_TOKEN_SECRET: Joi.string().required(),
        CUSTOMER_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        CUSTOMER_ACCESS_TOKEN_SECRET: Joi.string().required(),
        CUSTOMER_REFRESH_TOKEN_SECRET: Joi.string().required(),
        SERVER_BASE_URL: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        API_KEY: Joi.string().required()
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
    // { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    {
      provide: APP_GUARD,
      useClass: JwtEmployeeAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        stopAtFirstError: true,
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          const errorMessage = extractErrorMessageFromDto(validationErrors)
          return new UnprocessableEntityError(
            validationErrors.map((error, index) => ({
              field: error.property,
              message: errorMessage[index]
            }))
          )
        }
      })
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter
    // },
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter
    }
  ],
  exports: []
})
export class CoreModule {}
