import { ListAllOrdersUseCase } from '../../../../../src/application/use-cases/order/list-all-orders.use-case';
import { OrderRepository } from "../../../../../src/domain/repositories/order.repository";
import { Order } from '../../../../../src/domain/entities/order.entity'

describe('ListAllOrdersUseCase', () => {
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

  it('should return a list of orders', async () => {
    const orders = [{} as Order, {} as Order];
    (mockOrderRepository.findAll as jest.Mock).mockResolvedValue(orders);
    const useCase = new ListAllOrdersUseCase(mockOrderRepository);
    const result = await useCase.execute();

    expect(result).toEqual(orders);
    expect(mockOrderRepository.findAll).toHaveBeenCalled();
  });
});
