import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Joi from 'joi'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { client, database, environment, port, token, upload } from 'config'
import { TransformResponseInterceptor } from 'core/interceptors/transform-response.interceptor'
import { ValidationError } from 'class-validator'
import { RolesGuard } from 'core/guards/roles.guard'
import { CaslModule } from './casl/casl.module'
import { extractErrorMessageFromDto } from 'core/utils/utils'
import { JwtEmployeeAuthGuard } from 'core/guards/jwt-employee-auth.guard'
import { JwtCustomerAuthGuard } from 'core/guards/jwt-customer-auth.guard'
import { JwtAuthenticatedAuthGuard } from 'core/guards/jwt-authenticated-auth-.guard'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'
import HttpExceptionFilter from 'core/exceptions/http-exception-filter'
import AnyExceptionFilter from 'core/exceptions/any-exception-filter'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment, port, database, token, upload, client],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').required(),
        PORT: Joi.number().port().required(),
        DATABASE_URI: Joi.string().required(),
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
        CUSTOMER_REFRESH_TOKEN_SECRET: Joi.string().required()
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
      provide: APP_GUARD,
      useClass: JwtEmployeeAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: JwtCustomerAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticatedAuthGuard
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
    }
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: AnyExceptionFilter
    // }
  ],
  exports: []
})
export class CoreModule {}
