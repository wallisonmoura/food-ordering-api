import { OrderRepository } from '../../../domain/repositories/order.repository';
import { Order } from '../../../domain/entities/order.entity';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

export interface UpdateOrderInput {
  status?: OrderStatus;
}

export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string, input: UpdateOrderInput): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (input.status) {
      order.updateStatus(input.status);
    }

    await this.orderRepository.update(order);
    return order;
  }
}
