import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { OrderStatus } from 'core/constants/enum';
import { Server, Socket } from 'socket.io';
export declare class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly configService;
    private readonly jwtService;
    constructor(configService: ConfigService, jwtService: JwtService);
    server: Server;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    emitNewOrderByCustomer(orderInfo: {
        tableNumber: number;
        quantity: number;
    }): void;
    emitNewOrderByEmployee(customerId: string, orderInfo: {
        tableNumber: number;
        quantity: number;
    }): Promise<void>;
    emitUpdateOrder(customerCode: string, updateInfo: {
        dishTitle: string;
        status: OrderStatus;
    }): Promise<void>;
    emitLogout(customerId: string): Promise<void>;
}
