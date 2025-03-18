import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { AuthTokenPayload, CustomerTokenPayload } from 'core/types/type'
import { Socket } from 'socket.io'

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private logger: Logger = new Logger(WsJwtAuthGuard.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>()
      const accessToken: string = client.handshake?.auth?.authorization
      const role = client.handshake?.auth?.role as 'employee' | 'customer'

      if (accessToken) {
        try {
          if (role === 'employee') {
            const decoded = await this.jwtService.verifyAsync<AuthTokenPayload>(accessToken, {
              secret: this.configService.get<string>('employeeAccessToken.secret')
            })
            client.data = decoded
          } else {
            const decoded = await this.jwtService.verifyAsync<CustomerTokenPayload>(accessToken, {
              secret: this.configService.get<string>('customerAccessToken.secret')
            })
            client.data = decoded
          }
          console.log('✅ Client connected: ', client.id)
        } catch (error) {
          console.log(error)
          client.emit('unauthorized_error', {
            message: 'Unauthorized'
          })
          console.log('❌ Invalid AccessToken')
          client.disconnect()
        }
      } else {
        client.emit('unauthorized_error', {
          message: 'Unauthorized'
        })
        console.log('❌ Invalid AccessToken')
        client.disconnect()
      }
      // const user: User = await this.authService.verifyUser(authToken)
      // client.join(`house_${user?.house?.id}`)
      // context.switchToHttp().getRequest().user = client.data
      return Boolean(client.data)
    } catch (err: any) {
      throw new WsException(err.message)
    }
  }
}
