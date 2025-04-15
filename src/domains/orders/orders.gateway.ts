import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { OrderStatus } from 'core/constants/enum'
import { AuthTokenPayload, CustomerTokenPayload } from 'core/types/type'
import { Server, Socket } from 'socket.io'

const EMPLOYEE_ROOM = 'employeeRoom'

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket', 'polling']
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  @WebSocketServer()
  server: Server

  // afterInit(server: Server) {
  //   console.log('OrdersGateway initialized')
  // }

  async handleConnection(client: Socket) {
    console.log('⚡Connecting...', client.id)

    const accessToken = client.handshake.auth.authorization
    const role = client.handshake.auth.role

    if (accessToken) {
      try {
        if (role === 'employee') {
          const decoded = await this.jwtService.verifyAsync<AuthTokenPayload>(accessToken, {
            secret: this.configService.get<string>('employeeAccessToken.secret')
          })
          client.data = decoded
          // Nhân viên quán ăn thì Join vào 1 room
          client.join(EMPLOYEE_ROOM)
        } else {
          const decoded = await this.jwtService.verifyAsync<CustomerTokenPayload>(accessToken, {
            secret: this.configService.get<string>('customerAccessToken.secret')
          })
          client.data = decoded
          // Khách hàng thì ta chỉ cần lưu vào 1 biến private ở trên (this.client)
          // Tạo một room = vs CustomerCode giữa Socket Server và KH
          // client.join(decoded.code)
        }
        console.log('✅ Client connected successfull:', client.id)
      } catch (error) {
        console.log(error)
        this.server.emit('unauthorized_error', {
          message: 'Unauthorized'
        })
        console.log('❌ Invalid AccessToken')
        client.disconnect()
      }
    } else {
      this.server.emit('unauthorized_error', {
        message: 'Unauthorized'
      })
      console.log('❌ Invalid AccessToken')
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`🚪Client disconnected: ${client.id}`)
  }

  // ---------------------------- Active emit event to client ----------------------------
  emitNewOrderByCustomer(orderInfo: { tableNumber: number; quantity: number }) {
    this.server.in(EMPLOYEE_ROOM).emit('newOrders', orderInfo)
  }

  async emitNewOrderByEmployee(customerId: string, orderInfo: { tableNumber: number; quantity: number }) {
    const sockets = await this.server.fetchSockets()
    const socketId = sockets.find((socket) => (socket.data as CustomerTokenPayload)._id === customerId)?.id
    if (socketId) this.server.to(socketId).emit('newOrders', orderInfo)
    this.server.in(EMPLOYEE_ROOM).emit('newOrders', orderInfo)
  }

  async emitUpdateOrder(customerCode: string, updateInfo: { dishTitle: string; status: OrderStatus }) {
    const sockets = await this.server.fetchSockets()
    const socketId = sockets.find((socket) => (socket.data as CustomerTokenPayload).code === customerCode)?.id
    if (socketId) this.server.to(socketId).emit('updatedOrder', updateInfo)
    this.server.in(EMPLOYEE_ROOM).emit('updatedOrder', updateInfo)
  }

  async emitLogout(customerId: string) {
    const sockets = await this.server.fetchSockets()
    const socketId = sockets.find((socket) => (socket.data as CustomerTokenPayload)._id === customerId)?.id
    if (socketId) this.server.to(socketId).emit('logout')
  }

  // ---------------------------- Listen event from client and proccess ----------------------------
  // @SubscribeMessage('newOrder')
  // handleEvent(client: Socket, data: string): void {

  // }

  // @SubscribeMessage('newOrder2')
  // handleEvent2(@ConnectedSocket() client: Socket, data: string): void {
  //   this.server.emit('events')
  // }
}
