import { UpdatePaymentStatusUseCase } from '../../../../../src/application/use-cases/payment/update-payment-status.use-case'
import { PaymentRepository } from '../../../../../src/domain/repositories/payment.repository'
import { Payment } from '../../../../../src/domain/entities/payment.entity'
import { PaymentStatus } from '../../../../../src/domain/enums/payment-status.enum'
import { PaymentMethod } from '../../../../../src/domain/enums/payment-method.enum'

describe('UpdatePaymentStatusUseCase', () => {
  let mockRepository: jest.Mocked<PaymentRepository>
  let useCase: UpdatePaymentStatusUseCase
  let payment: Payment

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    }
    payment = new Payment('order-1', PaymentMethod.CREDIT_CARD, 100)

    useCase = new UpdatePaymentStatusUseCase(mockRepository)
  })

  it('should update status to APPROVED', async () => {
    mockRepository.findById.mockResolvedValue(payment)

    const result = await useCase.execute({ paymentId: payment.id, status: PaymentStatus.APPROVED })

    expect(result.status).toBe(PaymentStatus.APPROVED)
    expect(mockRepository.update).toHaveBeenCalledWith(payment)
  })

  it('should throw error if payment not found', async () => {
    mockRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ paymentId: 'unknown', status: PaymentStatus.APPROVED }))
      .rejects.toThrow('Payment unknown not found')
  })

  it('should reject status appropriately', async () => {
    mockRepository.findById.mockResolvedValue(payment)

    const result = await useCase.execute({ paymentId: payment.id, status: PaymentStatus.REJECTED })

    expect(result.status).toBe(PaymentStatus.REJECTED)
  })

  it('should cancel status appropriately', async () => {
    mockRepository.findById.mockResolvedValue(payment)

    const result = await useCase.execute({ paymentId: payment.id, status: PaymentStatus.CANCELLED })

    expect(result.status).toBe(PaymentStatus.CANCELLED)
  })

  it('should throw error for invalid status', async () => {
    mockRepository.findById.mockResolvedValue(payment)

    await expect(useCase.execute({ paymentId: payment.id, status: 'unknown' as any }))
      .rejects.toThrow('Invalid status unknown')
  })
})
