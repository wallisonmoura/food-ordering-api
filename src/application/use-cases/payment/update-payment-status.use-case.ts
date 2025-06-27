import { PaymentRepository } from "../../../domain/repositories/payment.repository"
import { Payment } from "../../../domain/entities/payment.entity"
import { PaymentStatus } from "../../../domain/enums/payment-status.enum"

export interface UpdatePaymentStatusInput {
  paymentId: string
  status: PaymentStatus
}

export class UpdatePaymentStatusUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(input: UpdatePaymentStatusInput): Promise<Payment> {
    const payment = await this.paymentRepository.findById(input.paymentId)

    if (!payment) {
      throw new Error(`Payment ${input.paymentId} not found.`)
    }

    // Os métodos de mudança de status são definidos pela própria entity
    switch (input.status) {
      case PaymentStatus.APPROVED:
        payment.approve()
        break
      case PaymentStatus.REJECTED:
        payment.reject()
        break
      case PaymentStatus.CANCELLED:
        payment.cancel()
        break
      default:
        throw new Error(`Invalid status ${input.status}`)
    }

    await this.paymentRepository.update(payment)
    return payment
  }
}
