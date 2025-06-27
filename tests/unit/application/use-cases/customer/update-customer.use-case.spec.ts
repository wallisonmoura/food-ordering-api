import { Customer } from '../../../../../src/domain/entities/customer.entity'
import { Address } from '../../../../../src/domain//value-objects/address.vo'
import { Document } from '../../../../../src/domain//value-objects/document.vo'
import { CustomerRepository } from "../../../../../src/domain/repositories/customer.repository"
import { UpdateCustomerUseCase } from '../../../../../src/application/use-cases/customer/update-customer.use-case'

describe('UpdateCustomerUseCase', () => {
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

  it('should update an existing customer', async () => {
    const existingCustomer = new Customer(
      'John Doe',
      'john@example.com',
      '81999999999',
      new Document('12345678901'),
      new Address('Rua A', '123', 'Recife', 'PE', '50000-000'),
      '1'
    );
    (mockRepository.findById as jest.Mock).mockResolvedValue(existingCustomer);
    const useCase = new UpdateCustomerUseCase(mockRepository);
    const result = await useCase.execute({
      id: '1',
      name: 'Updated Name',
      email: 'updated@example.com',
      phone: '81988888888',
      document: '12345678901',
      address: {
        street: 'Rua B',
        number: '456',
        city: 'Recife',
        state: 'PE',
        zipCode: '50000-001',
      },
    })

    expect(result.name).toBe('Updated Name');
    expect(result.email).toBe('updated@example.com');
    expect(mockRepository.update).toHaveBeenCalledWith(result);
  });

  it('should throw an error if customer is not found', async () => {
    (mockRepository.findById as jest.Mock).mockResolvedValue(null);
    const useCase = new UpdateCustomerUseCase(mockRepository);

    await expect(
      useCase.execute({
        id: 'unknown',
        name: 'Name',
        email: 'email@example.com',
        phone: '81999999999',
        document: '12345678901',
        address: {
          street: 'Rua A',
          number: '123',
          city: 'Recife',
          state: 'PE',
          zipCode: '50000-000',
        },
      })
    ).rejects.toThrow('Customer not found');

    expect(mockRepository.update).not.toHaveBeenCalled();
  });
})
