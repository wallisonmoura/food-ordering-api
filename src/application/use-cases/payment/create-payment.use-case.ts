import { Payment } from "../../../domain/entities/payment.entity";
import { PaymentMethod } from "../../../domain/enums/payment-method.enum";
import { PaymentRepository } from "../../../domain/repositories/payment.repository";

export interface CreatePaymentInput {
  orderId: string
  amount: number
  method: PaymentMethod
}

export class CreatePaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(input: CreatePaymentInput): Promise<Payment> {
    const payment = new Payment(input.orderId, input.method, input.amount)

    await this.paymentRepository.create(payment)

    return payment
  }
}
