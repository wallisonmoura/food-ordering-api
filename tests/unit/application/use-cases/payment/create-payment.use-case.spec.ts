import { CreatePaymentUseCase } from '../../../../../src/application/use-cases/payment/create-payment.use-case'
import { PaymentRepository } from '../../../../../src/domain/repositories/payment.repository'
import { Payment } from '../../../../../src/domain/entities/payment.entity'
import { PaymentMethod } from '../../../../../src/domain/enums/payment-method.enum'

describe('CreatePaymentUseCase', () => {
  let mockRepository: jest.Mocked<PaymentRepository>
  let useCase: CreatePaymentUseCase

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    }
    useCase = new CreatePaymentUseCase(mockRepository)
  })

  it('should create a new payment', async () => {
    const input = {
      orderId: 'order-1',
      method: PaymentMethod.CREDIT_CARD,
      amount: 100,
    }

    const result = await useCase.execute(input)

    expect(result).toBeInstanceOf(Payment)
    expect(result.orderId).toBe(input.orderId)
    expect(result.method).toBe(input.method)
    expect(result.amount).toBe(input.amount)

    expect(mockRepository.create).toHaveBeenCalledWith(result)
  })

  it('should throw error if amount is invalid', async () => {
    const input = {
      orderId: 'order-1',
      method: PaymentMethod.CREDIT_CARD,
      amount: 0,
    }

    await expect(useCase.execute(input)).rejects.toThrow('amount must be greater than 0')
  })

  it('should throw error if orderId is not provided', async () => {
    const input = {
      orderId: '', // Sem id
      method: PaymentMethod.CREDIT_CARD,
      amount: 100,
    }

    await expect(useCase.execute(input)).rejects.toThrow('orderId is required')
  })
})
