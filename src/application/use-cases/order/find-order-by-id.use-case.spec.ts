import { FindOrderByIdUseCase } from './find-order-by-id.use-case';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { Order } from '../../../domain/entities/order.entity';

describe('FindOrderByIdUseCase', () => {
  const mockOrderRepository: OrderRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an order by id', async () => {
    const order = {} as Order;
    (mockOrderRepository.findById as jest.Mock).mockResolvedValue(order);

    const useCase = new FindOrderByIdUseCase(mockOrderRepository);
    const result = await useCase.execute('1');

    expect(result).toBe(order);
    expect(mockOrderRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should throw error if order not found', async () => {
    (mockOrderRepository.findById as jest.Mock).mockResolvedValue(null);

    const useCase = new FindOrderByIdUseCase(mockOrderRepository);

    await expect(useCase.execute('unknown')).rejects.toThrow(
      'Order unknown not found'
    );
  });
});
