import { OrderStatus } from 'core/constants/enum'

type FSM = Record<OrderStatus, OrderStatus[]>

export const orderStatusFSM: FSM = {
  [OrderStatus.Pending]: [OrderStatus.Confirmed, OrderStatus.Canceled, OrderStatus.Rejected],
  [OrderStatus.Confirmed]: [OrderStatus.Cooked, OrderStatus.Canceled],
  [OrderStatus.Cooked]: [OrderStatus.Served, OrderStatus.Canceled],
  [OrderStatus.Served]: [OrderStatus.Paid],
  [OrderStatus.Paid]: [],
  [OrderStatus.Canceled]: [],
  [OrderStatus.Rejected]: []
}
