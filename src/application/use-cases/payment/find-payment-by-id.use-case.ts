import { PaymentRepository } from "../../../domain/repositories/payment.repository"
import { Payment } from "../../../domain/entities/payment.entity"

export class FindPaymentByIdUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(paymentId)

    if (!payment) {
      throw new Error(`Payment ${paymentId} not found.`)
    }

    return payment
  }
}
