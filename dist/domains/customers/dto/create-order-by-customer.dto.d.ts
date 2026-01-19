import { CreateOrderDto } from 'domains/orders/dto/create-order.dto';
declare const CreateOrderByCustomerDto_base: import("@nestjs/mapped-types").MappedType<Omit<CreateOrderDto, "tableNumber">>;
export declare class CreateOrderByCustomerDto extends CreateOrderByCustomerDto_base {
}
export {};
