import { FindPaymentByIdUseCase } from '../../../../../src/application/use-cases/payment/find-payment-by-id.use-case'
import { PaymentRepository } from '../../../../../src/domain/repositories/payment.repository'
import { Payment } from '../../../../../src/domain/entities/payment.entity'
import { PaymentMethod } from '../../../../../src/domain/enums/payment-method.enum'

describe('FindPaymentByIdUseCase', () => {
  let mockRepository: jest.Mocked<PaymentRepository>
  let useCase: FindPaymentByIdUseCase
  let payment: Payment

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    }
    payment = new Payment('order-1', PaymentMethod.CREDIT_CARD, 100)
    useCase = new FindPaymentByIdUseCase(mockRepository)
  })

  it('should return a payment if found', async () => {
    mockRepository.findById.mockResolvedValue(payment)

    const result = await useCase.execute(payment.id)

    expect(result).toBe(payment)
  })

  it('should throw error if payment not found', async () => {
    mockRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute('unknown')).rejects.toThrow('Payment unknown not found')
  })
})
