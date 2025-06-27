import { Payment } from "../entities/payment.entity"

export interface PaymentRepository {
  create(payment: Payment): Promise<void>
  findById(id: string): Promise<Payment | null>
  update(payment: Payment): Promise<void>
  findAll(): Promise<Payment[]>
}
