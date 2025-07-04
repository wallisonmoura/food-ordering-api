import { Customer } from "../../../../../src/domain/entities/customer.entity"
import { Address } from "../../../../../src/domain//value-objects/address.vo"
import { Document } from "../../../../../src/domain//value-objects/document.vo"
import { FindCustomerByIdUseCase } from "../../../../../src/application/use-cases/customer/find-customer-by-id.use-case"
import { CustomerRepository } from "../../../../../src/domain/repositories/customer.repository"

describe('FindCustomerByIdUseCase', () => {
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

  it('should return a customer if found', async () => {
    const customer = new Customer(
      'John Doe',
      'john@example.com',
      '81999999999',
      new Document('12345678901'),
      new Address('Rua A', '123', 'Recife', 'PE', '50000-000'),
      '1'
    );
    (mockRepository.findById as jest.Mock).mockResolvedValue(customer)

    const useCase = new FindCustomerByIdUseCase(mockRepository);
    const result = await useCase.execute('1');

    expect(result).toBe(customer);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  })

  it('should throw an error if customer not found', async () => {
    (mockRepository.findById as jest.Mock).mockResolvedValue(null);

    const useCase = new FindCustomerByIdUseCase(mockRepository);

    await expect(useCase.execute('unknown')).rejects.toThrow('Customer not found');
    expect(mockRepository.findById).toHaveBeenCalledWith('unknown');
  });
})
