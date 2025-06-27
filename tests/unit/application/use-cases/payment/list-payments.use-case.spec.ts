import { ListPaymentsUseCase } from '../../../../../src/application/use-cases/payment/list-payments.use-case'
import { PaymentRepository } from '../../../../../src/domain/repositories/payment.repository'
import { Payment } from '../../../../../src/domain/entities/payment.entity'
import { PaymentMethod } from '../../../../../src/domain/enums/payment-method.enum'

describe('ListPaymentsUseCase', () => {
  let mockRepository: jest.Mocked<PaymentRepository>
  let useCase: ListPaymentsUseCase
  let payments: Payment[]

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    }
    payments = [
      new Payment('order-1', PaymentMethod.CREDIT_CARD, 100),
      new Payment('order-2', PaymentMethod.PIX, 50),
    ]
    useCase = new ListPaymentsUseCase(mockRepository)
  })

  it('should return all payments', async () => {
    mockRepository.findAll.mockResolvedValue(payments)

    const result = await useCase.execute()
    expect(result).toEqual(payments)
  })
})
