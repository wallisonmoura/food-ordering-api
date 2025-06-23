import { OrderRepository } from '../../../domain/repositories/order.repository';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { Order } from '../../../domain/entities/order.entity';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

interface CreateOrderInput {
  customerId: string;
  orderItems: {
    productId: string;
    quantity: number;
    selectedCustomizations?: string[];
  }[];
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const customer = await this.customerRepository.findById(input.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const orderItems: OrderItem[] = [];
    for (const item of input.orderItems) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const orderItem = new OrderItem(product, item.quantity, item.selectedCustomizations ?? []);
      orderItems.push(orderItem);
    }

    const order = new Order(customer, orderItems, OrderStatus.PENDING);
    await this.orderRepository.create(order);
    return order;
  }
}
