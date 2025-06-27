import { Customer } from '../../../../../src/domain/entities/customer.entity'
import { Address } from '../../../../../src/domain//value-objects/address.vo'
import { Document } from '../../../../../src/domain//value-objects/document.vo'
import { ListAllCustomersUseCase } from '../../../../../src/application/use-cases/customer/list-all-customers.use-case';
import { CustomerRepository } from '../../../../../src/domain/repositories/customer.repository'
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
