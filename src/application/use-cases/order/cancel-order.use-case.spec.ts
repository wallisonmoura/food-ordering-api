import { CancelOrderUseCase } from './cancel-order.use-case';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { Order } from '../../../domain/entities/order.entity';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { Customer } from '../../../domain/entities/customer.entity';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

describe('CancelOrderUseCase', () => {
  const mockOrderRepository: OrderRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let order: Order;

  beforeEach(() => {
    jest.clearAllMocks();
    order = new Order({} as Customer, [] as OrderItem[]);
  });

  it('should cancel the order if status allows', async () => {
    (mockOrderRepository.findById as jest.Mock).mockResolvedValue(order);

    const useCase = new CancelOrderUseCase(mockOrderRepository);
    const result = await useCase.execute(order.id);

    expect(result.getStatus()).toBe(OrderStatus.CANCELLED);
    expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
  });

  it('should throw error if order not found', async () => {
    (mockOrderRepository.findById as jest.Mock).mockResolvedValue(null);

    const useCase = new CancelOrderUseCase(mockOrderRepository);

    await expect(useCase.execute('unknown')).rejects.toThrow(
      'Order unknown not found'
    );
  });

  it('should throw error if status does not allow cancellation', async () => {
    (mockOrderRepository.findById as jest.Mock).mockResolvedValue(order);

    // Simula status final
    order.updateStatus(OrderStatus.PAID);
    order.updateStatus(OrderStatus.PREPARING);
    order.updateStatus(OrderStatus.READY);
    order.updateStatus(OrderStatus.SHIPPED);
    order.updateStatus(OrderStatus.DELIVERED);

    const useCase = new CancelOrderUseCase(mockOrderRepository);

    await expect(useCase.execute(order.id)).rejects.toThrow(
      `Invalid status transition from delivered to cancelled`
    );
  });
});
