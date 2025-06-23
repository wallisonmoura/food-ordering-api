import { ListAllCustomersUseCase } from './list-all-customers.use-case';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { Customer } from '../../../domain/entities/customer.entity';
import { Document } from '../../../domain/value-objects/document.vo';
import { Address } from '../../../domain/value-objects/address.vo';

describe('ListAllCustomersUseCase', () => {
  const mockRepository: CustomerRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of customers', async () => {
    const customers = [
      new Customer(
        'John Doe',
        'john@example.com',
        '81999999999',
        new Document('12345678901'),
        new Address('Rua A', '123', 'Recife', 'PE', '50000-000'),
        '1'
      ),
      new Customer(
        'Jane Doe',
        'jane@example.com',
        '81988888888',
        new Document('12345678902'),
        new Address('Rua B', '456', 'Recife', 'PE', '50000-001'),
        '2'
      )
    ];
    (mockRepository.findAll as jest.Mock).mockResolvedValue(customers);

    const useCase = new ListAllCustomersUseCase(mockRepository);
    const result = await useCase.execute();

    expect(result).toEqual(customers);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
