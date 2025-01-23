import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

export interface Response<T> {
  statusCode: number
  message: string
  data: T
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const { statusCode } = context.switchToHttp().getResponse()

    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return {
            statusCode,
            message: response.message ?? 'Không có dữ liệu trả về',
            data: []
          }
        }
        if (response.data && response.meta) {
          return {
            statusCode,
            message: response.message,
            data: response,
            meta: response.meta
          }
        }
        return { statusCode, message: response.message, data: response }
      })
    )
  }
}
