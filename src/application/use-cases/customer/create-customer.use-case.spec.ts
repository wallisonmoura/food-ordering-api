import { Customer } from "../../../domain/entities/customer.entity"
import { CustomerRepository } from "../../../domain/repositories/customer.repository"
import { Address } from "../../../domain/value-objects/address.vo"
import { Document } from "../../../domain/value-objects/document.vo"
import { CreateCustomerUseCase } from "./create-customer.use-case"

describe('CreateCustomerUseCase', () => {
  const mockRepository: CustomerRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new customer', async () => {
    (mockRepository.findByEmail as jest.Mock).mockResolvedValue(null)

    const useCase = new CreateCustomerUseCase(mockRepository)

    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '81999999999',
      document: '12345678901',
      address: {
        street: 'Rua A',
        number: '123',
        city: 'Recife',
        state: 'PE',
        zipCode: '50000-000',
      }
    }

    const result = await useCase.execute(input)

    expect(result).toBeInstanceOf(Customer)
    expect(result.name).toBe(input.name)
    expect(result.email).toBe(input.email)
    expect(mockRepository.create).toHaveBeenCalledWith(result)
  })

  it('should throw an error if email already exists', async () => {
  // Simula um customer existente para retornar no findByEmail
  const existingCustomer = new Customer(
    'John Doe',
    'john@example.com',
    '81999999999',
    new Document('12345678901'),
    new Address('Rua A', '123', 'Recife', 'PE', '50000-000')
  )
  ;(mockRepository.findByEmail as jest.Mock).mockResolvedValue(existingCustomer)

  const useCase = new CreateCustomerUseCase(mockRepository)

  const input = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '81999999999',
    document: '12345678901',
    address: {
      street: 'Rua A',
      number: '123',
      city: 'Recife',
      state: 'PE',
      zipCode: '50000-000',
    },
  }

  await expect(useCase.execute(input)).rejects.toThrow('Email already in use')
  expect(mockRepository.create).not.toHaveBeenCalled()
})

})
