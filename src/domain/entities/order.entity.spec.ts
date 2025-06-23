import { Order } from './order.entity';
import { Customer } from './customer.entity';
import { OrderStatus } from '../enums/order-status.enum';

describe('Order Entity Status Transitions', () => {
  let order: Order;

  beforeEach(() => {
    const customer = {} as Customer;
    order = new Order(customer, []);
  });

  it('should transition from PENDING to PAID', () => {
    order.updateStatus(OrderStatus.PAID);
    expect(order.getStatus()).toBe(OrderStatus.PAID);
  });

  it('should transition from PAID to PREPARING', () => {
    order.updateStatus(OrderStatus.PAID);
    order.updateStatus(OrderStatus.PREPARING);
    expect(order.getStatus()).toBe(OrderStatus.PREPARING);
  });

  it('should transition from PREPARING to READY', () => {
    order.updateStatus(OrderStatus.PAID);
    order.updateStatus(OrderStatus.PREPARING);
    order.updateStatus(OrderStatus.READY);
    expect(order.getStatus()).toBe(OrderStatus.READY);
  });

  it('should transition from READY to SHIPPED', () => {
    order.updateStatus(OrderStatus.PAID);
    order.updateStatus(OrderStatus.PREPARING);
    order.updateStatus(OrderStatus.READY);
    order.updateStatus(OrderStatus.SHIPPED);
    expect(order.getStatus()).toBe(OrderStatus.SHIPPED);
  });

  it('should transition from SHIPPED to DELIVERED', () => {
    order.updateStatus(OrderStatus.PAID);
    order.updateStatus(OrderStatus.PREPARING);
    order.updateStatus(OrderStatus.READY);
    order.updateStatus(OrderStatus.SHIPPED);
    order.updateStatus(OrderStatus.DELIVERED);
    expect(order.getStatus()).toBe(OrderStatus.DELIVERED);
  });

  it('should transition from DELIVERED to COMPLETED', () => {
    order.updateStatus(OrderStatus.PAID);
    order.updateStatus(OrderStatus.PREPARING);
    order.updateStatus(OrderStatus.READY);
    order.updateStatus(OrderStatus.SHIPPED);
    order.updateStatus(OrderStatus.DELIVERED);
    order.updateStatus(OrderStatus.COMPLETED);
    expect(order.getStatus()).toBe(OrderStatus.COMPLETED);
  });

  it('should allow CANCELLED from any status except DELIVERED and COMPLETED', () => {
    order.updateStatus(OrderStatus.PAID);
    order.updateStatus(OrderStatus.CANCELLED);
    expect(order.getStatus()).toBe(OrderStatus.CANCELLED);
  });

  it('should throw error for invalid status transitions', () => {
    expect(() => order.updateStatus(OrderStatus.SHIPPED)).toThrow();
    order.updateStatus(OrderStatus.PAID);
    expect(() => order.updateStatus(OrderStatus.DELIVERED)).toThrow();
  });

  it('should not allow status changes after CANCELLED', () => {
    order.updateStatus(OrderStatus.CANCELLED);
    expect(() => order.updateStatus(OrderStatus.PAID)).toThrow();
  });

  it('should not allow status changes after COMPLETED', () => {
    order.updateStatus(OrderStatus.PAID);
    order.updateStatus(OrderStatus.PREPARING);
    order.updateStatus(OrderStatus.READY);
    order.updateStatus(OrderStatus.SHIPPED);
    order.updateStatus(OrderStatus.DELIVERED);
    order.updateStatus(OrderStatus.COMPLETED);
    expect(() => order.updateStatus(OrderStatus.CANCELLED)).toThrow();
  });
});
