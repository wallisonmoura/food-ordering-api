import { OrderRepository } from '../../../domain/repositories/order.repository';
import { Order } from '../../../domain/entities/order.entity';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

export class CancelOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    order.updateStatus(OrderStatus.CANCELLED);

    await this.orderRepository.update(order);
    return order;
  }
}
