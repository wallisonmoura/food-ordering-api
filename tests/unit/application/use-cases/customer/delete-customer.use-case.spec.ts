import { Customer } from "../../../../../src/domain/entities/customer.entity"
import { Address } from "../../../../../src/domain//value-objects/address.vo"
import { Document } from "../../../../../src/domain//value-objects/document.vo"
import { CustomerRepository } from "../../../../../src/domain/repositories/customer.repository"
import { DeleteCustomerUseCase } from "../../../../../src/application/use-cases/customer/delete-customer.use-case"

describe('DeleteCustomerUseCase', () => {
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

  it('should delete an existing customer', async () => {
    const existingCustomer = new Customer(
      'John Doe',
      'john@example.com',
      '81999999999',
      new Document('12345678901'),
      new Address('Rua A', '123', 'Recife', 'PE', '50000-000'),
      '1'
    );
    (mockRepository.findById as jest.Mock).mockResolvedValue(existingCustomer);

    const useCase = new DeleteCustomerUseCase(mockRepository);
    await useCase.execute('1');

    expect(mockRepository.findById).toHaveBeenCalledWith('1');
    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should throw error if customer not found', async () => {
    (mockRepository.findById as jest.Mock).mockResolvedValue(null);
    const useCase = new DeleteCustomerUseCase(mockRepository);

    await expect(useCase.execute('unknown')).rejects.toThrow('Customer not found');
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
