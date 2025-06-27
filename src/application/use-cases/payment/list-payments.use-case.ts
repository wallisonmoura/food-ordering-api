import { PaymentRepository } from "../../../domain/repositories/payment.repository"
import { Payment } from "../../../domain/entities/payment.entity"

export class ListPaymentsUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(): Promise<Payment[]> {
    return this.paymentRepository.findAll()
  }
}
