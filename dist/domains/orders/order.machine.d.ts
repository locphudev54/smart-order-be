import { OrderStatus } from 'core/constants/enum';
type FSM = Record<OrderStatus, OrderStatus[]>;
export declare const orderStatusFSM: FSM;
export {};
