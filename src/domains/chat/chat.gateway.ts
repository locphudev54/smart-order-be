import { UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { WsJwtAuthGuard } from 'core/guards/ws-jwt-auth.guard'
import { AuthTokenPayload, CustomerTokenPayload } from 'core/types/type'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat'
})
export class ChatGateway implements OnGatewayConnection {
  // constructor(
  //   private readonly configService: ConfigService,
  //   private readonly jwtService: JwtService
  // ) {}

  @WebSocketServer()
  server: Server
  private clients: Set<Socket> = new Set()

  afterInit(server: Server) {
    console.log('🟢ChatGateway initialized')
  }

  @UseGuards(WsJwtAuthGuard)
  async handleConnection(client: Socket) {
    this.clients.add(client)
    console.log('⚡Connecting', client.id)

    // const accessToken = client.handshake.auth.authorization
    // const role = client.handshake.auth.role

    // if (accessToken) {
    //   try {
    //     if (role === 'employee') {
    //       const decoded = await this.jwtService.verifyAsync<AuthTokenPayload>(accessToken, {
    //         secret: this.configService.get<string>('employeeAccessToken.secret')
    //       })
    //       client.data = decoded
    //     } else {
    //       const decoded = await this.jwtService.verifyAsync<CustomerTokenPayload>(accessToken, {
    //         secret: this.configService.get<string>('customerAccessToken.secret')
    //       })
    //       client.data = decoded
    //     }
    //     console.log('✅ Client connected: ', client.id)
    //   } catch (error) {
    //     console.log(error)
    //     client.emit('unauthorized_error', {
    //       message: 'Unauthorized'
    //     })
    //     console.log('❌ Invalid AccessToken')
    //     client.disconnect()
    //   }
    // } else {
    //   client.emit('unauthorized_error', {
    //     message: 'Unauthorized'
    //   })
    //   console.log('❌ Invalid AccessToken')
    //   client.disconnect()
    // }
  }

  handleDisconnect(client: Socket) {
    console.log(`🚪Client disconnected: ${client.id}`)
    this.clients.delete(client)
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    console.log(data)
    return data
  }
}
