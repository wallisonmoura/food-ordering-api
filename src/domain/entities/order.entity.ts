import { v4 as uuidv4 } from 'uuid'
import { OrderStatus } from '../enums/order-status.enum'
import { OrderItem } from './order-item.entity'
import { Customer } from './customer.entity'

export class Order {
  public readonly id: string
  public readonly createdAt: Date
  private status: OrderStatus
  private items: OrderItem[] = []

  constructor(
    public readonly customer: Customer,
    items: OrderItem[] = [],
    status: OrderStatus = OrderStatus.PENDING,
    id?: string,
    createdAt?: Date
  ) {
    this.id = id ?? uuidv4()
    this.createdAt = createdAt ?? new Date()
    this.status = status
    this.items = items

    if (!customer) {
      throw new Error('Customer is required')
    }
  }

  getStatus(): OrderStatus {
    return this.status
  }

  getItems(): OrderItem[] {
    return this.items
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.getTotal(), 0)
  }

  addItem(item: OrderItem): void {
    this.items.push(item)
  }

  removeItem(index: number): void {
    this.items.splice(index, 1)
  }

 updateStatus(newStatus: OrderStatus): void {
  if (this.status === OrderStatus.CANCELLED || this.status === OrderStatus.COMPLETED) {
    throw new Error(`Cannot update a ${this.status} order.`);
  }

  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
    [OrderStatus.READY]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.COMPLETED]: []
  };

  if (!allowedTransitions[this.status].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;
}
}
