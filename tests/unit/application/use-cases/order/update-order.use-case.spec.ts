import { Order } from '../../../../../src/domain/entities/order.entity'
import { UpdateOrderUseCase, UpdateOrderInput } from '../../../../../src/application/use-cases/order/update-order.use-case';
import { OrderRepository } from '../../../../../src/domain/repositories/order.repository';
import { OrderStatus } from '../../../../../src/domain/enums/order-status.enum';
import { Customer } from '../../../../../src/domain//entities/customer.entity';
import { OrderItem } from '../../../../../src/domain/entities/order-item.entity';

describe('UpdateOrderUseCase', () => {
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

  it('should update status of an existing order', async () => {
    (mockOrderRepository.findById as jest.Mock).mockResolvedValue(order);
    const useCase = new UpdateOrderUseCase(mockOrderRepository);

    await useCase.execute(order.id, { status: OrderStatus.PAID });
    expect(order.getStatus()).toBe(OrderStatus.PAID);
    expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
  });

  it('should throw error if order not found', async () => {
    (mockOrderRepository.findById as jest.Mock).mockResolvedValue(null);
    const useCase = new UpdateOrderUseCase(mockOrderRepository);

    await expect(useCase.execute('unknown', { status: OrderStatus.PAID }))
      .rejects.toThrow('Order unknown not found');
  });

  it('should throw error if status transition is invalid', async () => {
    (mockOrderRepository.findById as jest.Mock).mockResolvedValue(order);
    order.updateStatus(OrderStatus.PAID);

    const useCase = new UpdateOrderUseCase(mockOrderRepository);
    await expect(useCase.execute(order.id, { status: OrderStatus.DELIVERED }))
      .rejects.toThrow('Invalid status transition from PAID to DELIVERED');
  });
});
