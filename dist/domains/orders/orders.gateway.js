"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersGateway = void 0;
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const EMPLOYEE_ROOM = 'employeeRoom';
let OrdersGateway = class OrdersGateway {
    constructor(configService, jwtService) {
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        console.log('⚡Connecting...', client.id);
        const accessToken = client.handshake.auth.authorization;
        const role = client.handshake.auth.role;
        if (accessToken) {
            try {
                if (role === 'employee') {
                    const decoded = await this.jwtService.verifyAsync(accessToken, {
                        secret: this.configService.get('employeeAccessToken.secret')
                    });
                    client.data = decoded;
                    client.join(EMPLOYEE_ROOM);
                }
                else {
                    const decoded = await this.jwtService.verifyAsync(accessToken, {
                        secret: this.configService.get('customerAccessToken.secret')
                    });
                    client.data = decoded;
                }
                console.log('✅ Client connected successfull:', client.id);
            }
            catch (error) {
                console.log(error);
                this.server.emit('unauthorized_error', {
                    message: 'Unauthorized'
                });
                console.log('❌ Invalid AccessToken');
                client.disconnect();
            }
        }
        else {
            this.server.emit('unauthorized_error', {
                message: 'Unauthorized'
            });
            console.log('❌ Invalid AccessToken');
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`🚪Client disconnected: ${client.id}`);
    }
    emitNewOrderByCustomer(orderInfo) {
        this.server.in(EMPLOYEE_ROOM).emit('newOrders', orderInfo);
    }
    async emitNewOrderByEmployee(customerId, orderInfo) {
        const sockets = await this.server.fetchSockets();
        const socketId = sockets.find((socket) => socket.data._id === customerId)?.id;
        if (socketId)
            this.server.to(socketId).emit('newOrders', orderInfo);
        this.server.in(EMPLOYEE_ROOM).emit('newOrders', orderInfo);
    }
    async emitUpdateOrder(customerCode, updateInfo) {
        const sockets = await this.server.fetchSockets();
        const socketId = sockets.find((socket) => socket.data.code === customerCode)?.id;
        if (socketId)
            this.server.to(socketId).emit('updatedOrder', updateInfo);
        this.server.in(EMPLOYEE_ROOM).emit('updatedOrder', updateInfo);
    }
    async emitLogout(customerId) {
        const sockets = await this.server.fetchSockets();
        const socketId = sockets.find((socket) => socket.data._id === customerId)?.id;
        if (socketId)
            this.server.to(socketId).emit('logout');
    }
};
exports.OrdersGateway = OrdersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrdersGateway.prototype, "server", void 0);
exports.OrdersGateway = OrdersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        transports: ['websocket', 'polling']
    }),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService])
], OrdersGateway);
//# sourceMappingURL=orders.gateway.js.map